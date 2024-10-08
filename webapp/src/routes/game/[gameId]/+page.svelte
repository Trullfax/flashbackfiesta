<script lang="ts">
	import type { PageData } from './$types';
	import { tick } from 'svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { addToast } from '$lib/stores/toastStore';
	import { Confetti } from 'svelte-confetti';
	import { goto } from '$app/navigation';
	import { joinPresence, unsubscribePresence } from '$lib/playerTracking';
	import Toasts from '$lib/components/alert/Toasts.svelte';
	import CardTable from '$lib/components/CardTable.svelte';
	import PlayerDeck from '$lib/components/PlayerDeck.svelte';
	import PlayerSelfDeck from '$lib/components/PlayerSelfDeck.svelte';
	import EmojiClick from '$lib/components/EmojiClick.svelte';
	import FlyingPlayCards from '$lib/components/FlyingPlayCards.svelte';
	import LoadingBar from '$lib/components/LoadingBar.svelte';
	import GameEndScreen from '$lib/components/GameEndScreen.svelte';
	import type { RealtimeChannel } from '@supabase/supabase-js';

	export let data: PageData;

	let pageTitle = data.category.name + ' fiesta · Flashbackfiesta';

	let channels: RealtimeChannel | null = null;

	let storedPlayerId: string | null = null;
	let myPlayer: Player | null = null;
	let opponents: Player[] = [];
	let waitingFor: Player | null = null;
	let selectedCard: Card | null = null;
	let showConfetti: boolean = false;
	let cardIsCorrect: boolean = false;

	// Reactive block to handle assigned player and opponents
	$: {
		try {
			if (storedPlayerId && data.players) {
				myPlayer = data.players.find((player) => player.id === storedPlayerId) || null;

				if (!myPlayer) {
					throw new Error(`Player with ID ${storedPlayerId} not found`);
				}

				opponents = data.players.filter((player) => player.id !== storedPlayerId);
				waitingFor = opponents.find((player) => player.id === data.game.whose_turn_id) || null;
			}
		} catch (err) {}
	}

	const { gameId } = $page.params;

	onMount(() => {
		try {
			if (typeof window !== 'undefined') {
				storedPlayerId = localStorage.getItem('playerId');

				if (!storedPlayerId) {
					throw new Error('player not found in local storage');
				}

				const playerExists = data.players.some((player) => player.id === storedPlayerId);

				if (!playerExists) {
					throw new Error('no matching player found in game');
				}

				for (const player of data.players) {
					if (player.id === storedPlayerId) {
						myPlayer = player;
						break;
					}
				}
			}
		} catch (err) {
			console.warn('Error:', (err as Error).message);
			goto('/error');
		}

		if (myPlayer) {
			joinPresence(myPlayer, data.game);
		}

		channels = supabase
			.channel(gameId)
			.on(
				'postgres_changes',
				{ event: 'UPDATE', schema: 'public', filter: `game_id=eq.${gameId}`, table: 'Player' },
				handlePlayerUpdates
			)
			.on(
				'postgres_changes',
				{ event: 'UPDATE', schema: 'public', filter: `id=eq.${gameId}`, table: 'Game' },
				handleGameUpdates
			)
			.on(
				'postgres_changes',
				{ event: 'UPDATE', schema: 'public', filter: `game_id=eq.${gameId}`, table: 'Card' },
				handleCardUpdates
			)
			.on(
				'postgres_changes',
				{ event: 'DELETE', schema: 'public', filter: `game_id=eq.${gameId}`, table: 'Player' }, // ATTENTION: filter: 'id=eq.${gameId}' for event: DELETE not supported by Supabase
				handlePlayerDeletes
			)
			.on('broadcast', { event: 'showAnswer' }, (broadcast) => {
				if (broadcast.payload.cardIsCorrect) {
					addToast({ message: `${broadcast.payload.playerName} was correct!`, type: 'success' });
				} else {
					addToast({ message: `${broadcast.payload.playerName} was wrong!`, type: 'error' });
				}
			})
			.subscribe();

		return () => {
			unsubscribePresence;
			channels?.unsubscribe();
		};
	});

	function handlePlayerUpdates(payload: { new: any }) {
		const newPlayer = payload.new;
		const existingPlayerIndex = data.players.findIndex((player) => player.id === newPlayer.id);
		data.players[existingPlayerIndex] = { ...data.players[existingPlayerIndex], ...newPlayer };
	}

	const handlePlayerDeletes = (payload: { old: any }) => {
		const deletedPlayerId = payload.old.id;
		data.players = data.players.filter((player) => player.id !== deletedPlayerId);
	};

	function handleGameUpdates(payload: { new: any }) {
		const newGame = payload.new;
		data.game = { ...data.game, ...newGame };

		if (newGame.status === 'completed') {
			channels?.unsubscribe();
		}
	}

	function handleCardUpdates(payload: { new: any }) {
		const newCard: Card = payload.new;

		if (newCard.played) {
			data.cards = data.cards.filter((card) => card.id !== newCard.id);
			data.tableCards = [...data.tableCards, newCard];

			tick().then(() => {
				const cardElement = document.getElementById(String(newCard.id));

				if (cardElement) {
					setTimeout(() => {
						cardElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
					}, 100);
					setTimeout(() => {
						(cardElement as HTMLElement).style.opacity = '.3';
					}, 700);
					setTimeout(() => {
						(cardElement as HTMLElement).style.opacity = '1';
					}, 1500);
				}
			});
		} else {
			data.cards = [...data.cards, newCard];
		}
	}

	// Compute classes based on number of opponents
	$: playerClasses = opponents.map((_, i) => {
		const count = opponents.length;
		switch (count) {
			case 1:
				return 'col-span-1-opponent';
			case 2:
				return 'col-span-2-opponent';
			case 3:
				return 'col-span-3-opponent';
			default:
				return '';
		}
	});

	function handleCardSubmit(event: Event) {
		try {
			const { myCardSelection } = (event as CustomEvent<{ myCardSelection: Card }>).detail;

			if (!myCardSelection) {
				throw new Error('something went wrong with the card selection');
			}
			selectedCard = myCardSelection;
		} catch (err) {
			console.error('Error:', (err as Error).message);
			addToast({ message: (err as Error).message || 'An unknown error occurred', type: 'error' });
			return;
		}
	}

	async function handleCardPlacement(event: CustomEvent<{ index: number; myCardSelection: Card }>) {
		try {
			if (!data.game.winner_id) {
				if (data.game.whose_turn_id !== myPlayer?.id) {
					addToast({ message: 'It is not your turn!', type: 'error' });
					return;
				}

				const { index, myCardSelection } = event.detail;
				selectedCard = myCardSelection;

				const response = await fetch('/api/update-game/', {
					method: 'POST',
					body: JSON.stringify({
						game: data.game,
						category: data.category,
						selectedCard: selectedCard,
						cardPos: index,
						player: data.players.find((player) => player.id === storedPlayerId)
					}),
					headers: {
						'Content-Type': 'application/json'
					}
				});

				const { status, correct, winner, error } = await response.json();

				if (!response.ok || status === 'error') {
					throw new Error(error || 'An unknown error occurred');
				}
				if (status === 'success') {
					if (correct) {
						cardIsCorrect = true;
					} else {
						cardIsCorrect = false;
					}
					await supabase.channel(gameId).send({
						type: 'broadcast',
						event: 'showAnswer',
						payload: {
							cardIsCorrect: cardIsCorrect,
							playerName: myPlayer?.name || 'Unknown Player'
						}
					});
					if (winner) {
						addToast({ message: `The winner of this game is ${winner.name}`, type: 'success' });
					}
					if (winner.id === storedPlayerId) {
						showConfetti = true;
					}
					selectedCard = null;
				}
			}
		} catch (err) {
			console.error('Error:', (err as Error).message);
			return;
		}
	}

	async function handleBackToStart() {
		if (data.game.winner_id) {
			const response = await fetch('/api/delete-game', {
				method: 'POST',
				body: JSON.stringify({ gameId }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			goto('/');
		}
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<Toasts />

<main
	class="md:max-h-screen h-screen grid grid-rows-[auto_1fr_auto] md:grid-rows-3 items-center gap-5 bg-game-background bg-repeat-y bg-cover relative max-w-screen overflow-x-hidden"
>
	{#if myPlayer}
		{#if data.game.whose_turn_id !== myPlayer?.id && !data.game.winner_id}
			<div
				class="w-[12rem] z-20 absolute bottom-1/3 left-1/2 -translate-x-1/2 bg-purple md:bg-opacity-0 drop-shadow-bold md:drop-shadow-none p-5 md:p-0"
			>
				<p class="font-contrail text-2xl text-center text-white md:text-black">
					waiting for {waitingFor?.name}
				</p>
				<LoadingBar color={data.category.hex_color} />
			</div>
		{/if}
		{#if showConfetti}
			<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
				<Confetti
					size={10}
					x={[-2, 2]}
					y={[-2, 2]}
					delay={[0, 1000]}
					fallDistance="100px"
					amount={500}
					colorArray={[
						'var(--ff-purple)',
						'var(--ff-green)',
						'var(--ff-red)',
						'var(--ff-blue)',
						'var(--ff-yellow)'
					]}
				/>
			</div>
		{/if}

		<div
			class="grid grid-cols-6 gap-4 col-span-full pt-5 w-[100vw] md:w-[75vw] self-start sm:justify-self-center sticky md:relative top-0 z-20 md:bg-none bg-game-background bg-cover"
		>
			{#if opponents.length > 0}
				{#each opponents as player, i}
					<div class={playerClasses[i]}>
						<PlayerDeck
							{player}
							turn={data.game.whose_turn_id === player.id}
							category={data.category}
						/>
					</div>
				{/each}
			{/if}
		</div>

		<div class="col-span-full h-full md:h-auto grid relative z-10 overflow-y-scroll">
			<CardTable
				player={myPlayer}
				game={data.game}
				category={data.category}
				cards={data.tableCards.sort((a, b) => a.year - b.year)}
				{selectedCard}
				on:placecard={handleCardPlacement}
			/>
		</div>

		<div class="col-span-full z-20 relative bottom-0 md:bg-none bg-game-background bg-cover">
			{#if myPlayer}
				<PlayerSelfDeck
					{myPlayer}
					turn={data.game.whose_turn_id === myPlayer.id}
					category={data.category}
					cards={data.cards.filter((card) => myPlayer && card.player_id === myPlayer.id)}
					on:submitcard={handleCardSubmit}
				/>
			{/if}
		</div>

		<FlyingPlayCards category={data.category} />

		<EmojiClick {myPlayer} {gameId} />

		{#if data.game.winner_id && myPlayer}
			<GameEndScreen
				category={data.category}
				winner={data.players.find((player) => player.id === data.game.winner_id)}
				winner_self={data.game.winner_id === myPlayer.id}
				on:click={handleBackToStart}
			/>
		{/if}
	{/if}
</main>

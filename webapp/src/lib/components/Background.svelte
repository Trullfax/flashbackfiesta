<script lang="ts">
	import ziczac from '$lib/assets/background/elements/ziczac.svg';
	import blueBow from '$lib/assets/background/elements/blue-bow.svg';
	import blueSquare from '$lib/assets/background/elements/blue-square-lines.svg';
	import line from '$lib/assets/background/elements/line.svg';
	import purpleLine from '$lib/assets/background/elements/purple-line.svg';
	import yellowTriangle from '$lib/assets/background/yellow-triangle.svg';
	import whiteTriangleStroke from '$lib/assets/background/elements/white-triangle-stroke.svg';
	import whiteTriangleShadow from '$lib/assets/background/elements/white-triangle-shadow.svg';
	import dottedTriangle from '$lib/assets/background/dotted-triangle.svg';
	import playBtn from '$lib/assets/background/elements/playplayplay.svg';
	import yellowCylinder from '$lib/assets/background/elements/cylinder.svg';
	import gameBgTriangle from '$lib/assets/background/game-bg-triangle.svg';
	import redBlackLines from '$lib/assets/background/red-black-lines.svg';
	import cube from '$lib/assets/background/elements/cube.svg';
	import greenBow from '$lib/assets/background/elements/green-bow.svg';
	import whiteTriangleZicZac_Triangle from '$lib/assets/background/whiteTriangleZicZac_Triangle.svg';
	import whiteTriangleZicZac_ZicZac from '$lib/assets/background/whiteTriangleZicZac_ZicZac.svg';

	import CardFront from '$lib/components/CardFront.svelte';

	export let categoryPicturePath: string = '/assets/categories/game-card.svg';
	export let cards: Partial<Card>[] = [
		{
			name: 'The Godfather',
			year: 1972,
			creator: 'Francis Ford Coppola',
			picture_url: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg'
		},
		{
			name: 'Seinfeld',
			year: 1989,
			creator: 'Larry David, Jerry Seinfeld',
			picture_url: 'https://image.tmdb.org/t/p/w500/aCw8ONfyz3AhngVQa1E2Ss4KSUQ.jpg'
		},
		{
			name: 'The Avengers',
			year: 2012,
			creator: 'Joss Whedon',
			picture_url: 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg'
		},
		{
			name: 'Dexter',
			year: 2006,
			creator: 'James Manos, Jr.',
			picture_url: 'https://image.tmdb.org/t/p/w500/q8dWfc4JwQuv3HayIZeO84jAXED.jpg'
		}
	];
</script>

<div class="absolute w-screen top-0">
	<!-- SECTION 1: START -->
	<section class="relative h-dvh">
		<div>
			<div
				class="absolute z-30 scale-[65%] md:scale-[100%] drop-shadow-bold rotate-[150deg] -top-[6dvh] md:-top-[3dvh] -left-[9vw] md:left-[10vw]"
			>
				<CardFront
					title={cards[0].name ?? ''}
					subtitle={cards[0].creator ?? ''}
					imagePath={cards[0].picture_url ?? ''}
					accentColor={'var(--ff-red)'}
					year={Number(cards[0].year)}
					revealed={true}
				/>
			</div>
			<img
				src={whiteTriangleZicZac_Triangle}
				alt="background decoration"
				class="absolute z-0 h-[120dvh] md:h-[190dvh] -left-[7rem] md:left-0"
			/>
			<img
				src={whiteTriangleZicZac_ZicZac}
				alt="background decoration"
				class="absolute z-20 h-[120dvh] md:h-[190dvh] -left-[7rem] md:left-0"
			/>
			<img
				src={whiteTriangleStroke}
				alt="background decoration"
				class="invisible md:visible absolute min-h-[10dvh] max-h-[10dvh] right-[30vw]"
			/>
			<img
				src={blueSquare}
				alt="background decoration"
				class="absolute min-h-[15dvh] md:min-h-[25dvh] max-h-[15dvh] md:max-h-[25dvh] -right-[17vw] md:right-[5vw]"
			/>
			<img
				src={blueBow}
				alt="background decoration"
				class="absolute rotate-35 z-20 min-h-[15dvh] md:min-h-[30dvh] max-h-[15dvh] md:max-h-[30dvh] bottom-[5dvh] md:-bottom-[4dvh] -left-[8vw] md:left-[3vw]"
			/>
			<div
				class="absolute z-30 scale-[65%] md:scale-[100%] drop-shadow-bold -rotate-[15deg] bottom-[2dvh] md:bottom-[7dvh] -right-[10vw] md:right-[5vw]"
			>
				<CardFront
					title={cards[1].name ?? ''}
					subtitle={cards[1].creator ?? ''}
					imagePath={cards[1].picture_url ?? ''}
					accentColor={'var(--ff-green)'}
					year={Number(cards[1].year)}
					revealed={true}
				/>
			</div>
		</div>
	</section>

	<!-- SECTION 2: CATEGORY SELECTION -->
	<section class="relative h-dvh flex items-center justify-center">
		<div
			class="w-full h-[135dvh] z-10 bg-[url('$lib/assets/background/red-triangle.svg')] bg-center bg-cover overflow-visible bg-no-repeat -translate-y-[5dvh] md:-translate-y-[0dvh]"
		/>
		<img
			src={yellowTriangle}
			alt="background decoration"
			class="absolute h-[50dvh] md:h-[100dvh] right-0 -top-[30dvh] md:-top-[55dvh] z-20"
		/>
		<img
			src={gameBgTriangle}
			alt="background decoration"
			class="absolute h-[70dvh] md:h-[100dvh] right-0 -bottom-[40dvh] md:-bottom-[60dvh]"
		/>
		<img
			src={line}
			alt="background decoration"
			class="absolute z-30 min-h-[20dvh] md:min-h-[30dvh] max-h-[20dvh] md:max-h-[30dvh] top-[2dvh] md:-top-[8dvh] -right-[5vw] md:right-[16.25vw]"
		/>
		<img
			src={ziczac}
			alt="background decoration"
			class="absolute z-40 min-h-[20dvh] md:min-h-[30dvh] max-h-[20dvh] md:max-h-[30dvh] -left-[13vw] md:left-[16.5vw] -bottom-[8dvh] md:-bottom-[5dvh]"
		/>
		<img
			src={purpleLine}
			alt="background decoration"
			class="invisible md:visible absolute z-10 min-h-[8dvh] md:min-h-[10dvh] max-h-[8dvh] md:max-h-[10dvh] -right-[5vw] md:-right-[0vw] bottom-[0dvh] md:bottom-[21dvh]"
		/>
		<div
			class="absolute z-30 scale-[65%] md:scale-[100%] drop-shadow-bold rotate-[10deg] bottom-[8dvh] md:bottom-[15dvh] -left-[12vw] md:-left-[0vw]"
		>
			<CardFront
				title={cards[3].name ?? ''}
				subtitle={cards[3].creator ?? ''}
				imagePath={cards[3].picture_url ?? ''}
				accentColor={'var(--ff-green)'}
				year={Number(cards[3].year)}
				revealed={true}
			/>
		</div>
	</section>

	<!-- SECTION 3: CHARACTER SELECTION -->
	<section class="relative h-dvh">
		<img
			src={dottedTriangle}
			alt="background decoration"
			class="absolute h-[80dvh] md:h-[110dvh] -bottom-[50dvh] md:-bottom-[30dvh]"
		/>
		<img
			src={playBtn}
			alt="background decoration"
			class="absolute min-h-[3.5dvh] md:min-h-[5.5dvh] max-h-[3.5dvh] md:max-h-[5.5dvh] right-[27vw] md:right-[11vw] top-[5dvh]"
		/>
		<img
			src={ziczac}
			alt="background decoration"
			class="absolute rotate-[150deg] min-h-[20dvh] md:min-h-[26dvh] max-h-[20dvh] md:max-h-[26dvh] -right-[12vw] md:right-[1vw] -top-[0dvh] md:top-[20dvh]"
		/>
		<img
			src={categoryPicturePath}
			alt="background decoration"
			class="absolute -rotate-[15deg] drop-shadow-subtitle md:drop-shadow-bold min-h-[16.5dvh] md:min-h-[32dvh] max-h-[16.5dvh] md:max-h-[32dvh] bottom-[15dvh] md:bottom-[45dvh] -left-[12vw] md:left-[0vw]"
		/>
		<img
			src={yellowCylinder}
			alt="background decoration"
			class="absolute z-20 min-h-[20dvh] md:min-h-[50dvh] max-h-[20dvh] md:max-h-[50dvh] right-[0vw] bottom-[2dvh]"
		/>
		<img
			src={whiteTriangleShadow}
			alt="background decoration"
			class="invisible md:visible z-20 absolute min-h-[20dvh] max-h-[20dvh] right-1/2 -bottom-[8dvh]"
		/>
	</section>

	<!-- SECTION 4: LOBBY -->
	<section class="relative h-dvh flex items-center justify-center">
		<div
			class="w-full h-[120dvh] z-10 bg-[url('$lib/assets/background/blue-triangle.svg')] bg-center bg-cover overflow-visible bg-no-repeat -translate-y-[7dvh]"
		/>
		<img
			src={redBlackLines}
			alt="background decoration"
			class="absolute h-[70dvh] -left-[7rem] md:left-0 -bottom-[18dvh] md:-bottom-[5dvh] z-0"
		/>
		<img
			src={cube}
			alt="background decoration"
			class="absolute z-20 min-h-[15dvh] md:min-h-[35dvh] max-h-[15dvh] md:max-h-[35dvh] -left-[3vw] md:-left-[0vw] top-[5dvh] md:top-[8dvh]"
		/>
		<img
			src={line}
			alt="background decoration"
			class="absolute z-30 min-h-[15dvh] md:min-h-[30dvh] max-h-[15dvh] md:max-h-[30dvh] top-[2dvh] md:top-[4dvh] -right-[5vw] md:right-[6vw]"
		/>
		<div
			class="absolute z-40 drop-shadow-bold rotate-[15deg] scale-[65%] md:scale-[100%] top-[3dvh] md:top-[13dvh] -right-[19vw] md:right-[2vw]"
		>
			<CardFront
				title={cards[2].name ?? ''}
				subtitle={cards[2].creator ?? ''}
				imagePath={cards[2].picture_url ?? ''}
				accentColor={'var(--ff-red)'}
				year={Number(cards[2].year)}
				revealed={true}
			/>
		</div>
		<img
			src={greenBow}
			alt="background decoration"
			class="absolute z-20 min-h-[15dvh] md:min-h-[30dvh] max-h-[15dvh] md:max-h-[30dvh] bottom-[2dvh] md:bottom-[0dvh] -left-[2vw] md:left-[5vw]"
		/>
	</section>
</div>

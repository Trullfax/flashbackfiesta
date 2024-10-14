<script lang="ts">
	export let category: Category;
</script>

<div class="absolute h-screen w-screen overflow-hidden">
	<div class="fixed md:absolute rotate-45 top-1/2 -left-10 md:-left-20 top-50 z-10">
		<img
			src={category.picture_path}
			alt="categorycard for {category.name}"
			class="w-[4rem] md:w-[8rem]"
		/>
	</div>
	<div class="fixed md:absolute rotate-12 top-1/2 -left-10 md:-left-20 z-10">
		<img
			src={category.picture_path}
			alt="categorycard for {category.name}"
			class="w-[4rem] md:w-[8rem]"
		/>
	</div>
	<div class="fixed md:absolute -rotate-12 -right-5 top-20 md:-right-20 md:top-10 z-10">
		<img
			src={category.picture_path}
			alt="categorycard for {category.name}"
			class="w-[4rem] md:w-[8rem]"
		/>
	</div>
</div>

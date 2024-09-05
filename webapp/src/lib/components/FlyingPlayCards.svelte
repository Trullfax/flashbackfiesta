<script lang="ts">
    export let category: Category;
</script>

<div class="absolute rotate-45 -left-10 md:-left-20 top-50">
    <img
        src={category.picture_path}
        alt="categorycard for {category.name}"
        class="w-[4rem] md:w-[8rem]"
    />
</div>
<div class="absolute rotate-12 -left-10 md:-left-20">
    <img
        src={category.picture_path}
        alt="categorycard for {category.name}"
        class="w-[4rem] md:w-[8rem]"
    />
</div>
<div class="absolute -rotate-12 -right-5 top-20 md:-right-20 md:top-10">
    <img
        src={category.picture_path}
        alt="categorycard for {category.name}"
        class="w-[4rem] md:w-[8rem]"
    />
</div>
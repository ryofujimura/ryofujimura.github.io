<div class:md:hidden={!offsetWidth}>
	<div class="title" style:--offset="{offsetWidth}px">
		💻 {profileData ? profileData.title : 'Software Developer'}
	</div>

	<div class="bio-section">
		<p class="bio">{profileData ? profileData.bio : ''}</p>
		<a href="/about" class="about-link">Learn more</a>
	</div>

	{#if profileData && profileData.skills}
		{#each profileData.skills as skill}
			<details open={$activeFeaturedSkill === skill}>
				<summary
					class="title"
					style:--offset="{offsetWidth}px"
					on:click|preventDefault={() => onClick(skill)}
				>
					{skill}
				</summary>
				
				<div class="skill-content">
					<FeaturedWorks works={getRelatedWorks(skill)} />
				</div>
			</details>
		{/each}
	{:else}
		{#each featuredSkills as skill}
			<details open={$activeFeaturedSkill === skill.name}>
				<summary
					class="title"
					style:--offset="{offsetWidth}px"
					on:click|preventDefault={() => onClick(skill.name)}
				>
					{skill.name}
				</summary>

				<FeaturedWorks works={skill.works} />
			</details>
		{/each}
	{/if}
</div>

<style>
	.title {
		@apply leading-10;
	}

	.bio-section {
		margin-top: 0.5rem;
		margin-bottom: 1.5rem;
		padding-left: 2rem;
	}

	.bio {
		color: #666;
		line-height: 1.5;
		margin-bottom: 0.5rem;
	}

	.about-link {
		@apply text-amber-600 hover:text-amber-800;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.skill-content {
		margin-top: 0.5rem;
	}

	@screen md {
		.title {
			margin-left: calc(var(--offset) + 2rem);
		}

		.bio-section {
			margin-left: calc(var(--offset) + 2rem);
			max-width: 500px;
		}
	}

	summary {
		user-select: none;
		position: relative;
		display: inline-block;
		outline: 0;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	details[open] summary {
		font-weight: bold;
	}

	details[open] summary::before {
		content: '';
		position: absolute;
		left: 0;
		top: 100%;
		transform: rotate(45deg) scale(0.5);
		display: inline-block;
		border: 1em solid theme('colors.gray.100');
	}
</style>

<script lang="ts">
	import { skillsWithWorks } from '$lib/skills'
	import { activeFeaturedSkill, localStore } from '$lib/store'
	import FeaturedWorks from './FeaturedWorks.svelte'
	import { onMount } from 'svelte'

	export let offsetWidth: number

	let featuredSkills = skillsWithWorks
		.filter(({ featured, works }) => featured && works.length > 0)

	let profileData = null;
	let experiences = [];

	onMount(async () => {
		try {
			// Load profile data
			const profileResponse = await fetch('/profile.json');
			const profileJson = await profileResponse.json();
			profileData = profileJson.profile;

			// Load experiences data
			const experiencesResponse = await fetch('/experiences.json');
			const experiencesJson = await experiencesResponse.json();
			experiences = experiencesJson.experiences;
		} catch (error) {
			console.error('Error loading data:', error);
		}
	});

	function getRelatedWorks(skill) {
		// Match experiences that have tags related to the skill
		const skillMap = {
			"AI & Algorithms": ["ai_and_algorithms", "ai", "algorithms"],
			"Data Engineering": ["data_management", "data"],
			"Swift/SwiftUI": ["apple_development", "swift"],
			"Python": ["python"],
			"Web Development": ["web_app"],
			"Hardware & Systems": ["hardware_and_systems", "hardware"],
			"Blockchain": ["blockchain"]
		};

		const relevantTags = skillMap[skill] || [skill.toLowerCase().replace(/\s+/g, '_')];
		
		return experiences
			.filter(exp => {
				return exp.tags && exp.tags.some(tag => 
					relevantTags.some(rt => tag.toLowerCase().includes(rt.toLowerCase()))
				);
			})
			.map(exp => ({
				id: exp.title.toLowerCase().replace(/\s+/g, '-'),
				title: exp.title,
				subtitle: exp.subtitle,
				description: exp.short_description,
				skills: exp.tags || []
			}));
	}

	function onClick(name: string) {
		if ($activeFeaturedSkill === name) {
			$activeFeaturedSkill = null
		} else {
			$activeFeaturedSkill = name
		}

		localStore('activeFeaturedSkill', $activeFeaturedSkill)
	}
</script>

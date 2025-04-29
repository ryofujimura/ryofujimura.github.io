<SEO title="About Ryo Fujimura" />

<h1 class="h1">About</h1>

<div class="profile-container">
  <div class="profile-header">
    <img src={profile.img_path} alt={profile.name} class="profile-image" />
    <div class="profile-info">
      <h2 class="profile-name">{profile.name}</h2>
      <p class="profile-title">{profile.title}</p>
      <p class="profile-location">{profile.location}</p>
      <p class="profile-education">{profile.education}</p>
    </div>
  </div>
  
  <div class="profile-bio">
    <h3>Bio</h3>
    <p>{profile.bio}</p>
  </div>
  
  <div class="profile-sections">
    <div class="profile-section">
      <h3>Skills</h3>
      <ul class="skills-list">
        {#each profile.skills as skill}
          <li>{skill}</li>
        {/each}
      </ul>
    </div>
    
    <div class="profile-section">
      <h3>Interests</h3>
      <ul class="interests-list">
        {#each profile.interests as interest}
          <li>{interest}</li>
        {/each}
      </ul>
    </div>
  </div>
  
  <div class="social-links">
    <h3>Connect</h3>
    <div class="social-icons">
      <a href={profile.social_links.github} target="_blank" rel="noopener noreferrer" class="social-link">
        <span class="social-icon">GitHub</span>
      </a>
      <a href={profile.social_links.linkedin} target="_blank" rel="noopener noreferrer" class="social-link">
        <span class="social-icon">LinkedIn</span>
      </a>
      <a href={profile.social_links.instagram} target="_blank" rel="noopener noreferrer" class="social-link">
        <span class="social-icon">Instagram</span>
      </a>
    </div>
  </div>
</div>

<style>
  .profile-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .profile-image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    @apply border-2 border-amber-500;
  }

  .profile-info {
    text-align: center;
  }

  .profile-name {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.25rem;
  }

  .profile-title {
    font-size: 1.25rem;
    color: #666;
    margin-bottom: 0.5rem;
  }

  .profile-location, .profile-education {
    color: #666;
  }

  .profile-bio h3, .profile-section h3, .social-links h3 {
    font-weight: bold;
    margin-bottom: 0.5rem;
    @apply text-amber-600;
  }

  .profile-sections {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .skills-list, .interests-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .skills-list li, .interests-list li {
    background-color: #f3f4f6;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
  }

  .social-icons {
    display: flex;
    gap: 1rem;
  }

  .social-link {
    display: inline-block;
    padding: 0.5rem 1rem;
    @apply bg-gray-100 hover:bg-amber-100 transition-colors duration-200;
    border-radius: 4px;
    text-decoration: none;
  }

  @screen md {
    .profile-header {
      flex-direction: row;
      align-items: flex-start;
      text-align: left;
    }

    .profile-info {
      text-align: left;
    }

    .profile-sections {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>

<script lang="ts">
  import SEO from '$lib/SEO.svelte';
  import { onMount } from 'svelte';
  
  let profile = {
    name: '',
    title: '',
    bio: '',
    img_path: '',
    location: '',
    education: '',
    skills: [],
    interests: [],
    social_links: {
      github: '',
      linkedin: '',
      instagram: ''
    }
  };
  
  onMount(async () => {
    try {
      const response = await fetch('/profile.json');
      const data = await response.json();
      profile = data.profile;
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  });
</script>

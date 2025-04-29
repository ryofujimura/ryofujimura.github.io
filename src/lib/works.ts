// Define Work type for TypeScript
interface Work {
	id: string;
	title: string;
	subtitle?: string;
	term?: string;
	short_description?: string;
	long_description?: string;
	highlights?: string[];
	skills?: string[];
	tags?: string[];
	link?: string;
	github?: string;
	links?: string[];
	link_images?: string[];
	images?: string[];
	experience_type?: string;
}

// Default works for fallback
const defaultWorks: Work[] = [
	{
		id: 'ryofuj',
		title: 'ryofuj.com',
		skills: ['HTML / CSS', 'JavaScript', 'Git / GitHub'],
		link: 'https://ryofuj.netlify.app',
		github: 'ryofuj/ryofuj',
	},
	{
		id: 'order-burger',
		title: 'Order Burger',
		skills: ['Swift / SwiftUI'],
	}
];

// This is a client-side function to fetch experiences
async function fetchExperiences(): Promise<Work[]> {
	try {
		const response = await fetch('/experiences.json');
		if (!response.ok) {
			throw new Error(`Failed to fetch experiences: ${response.status}`);
		}
		const data = await response.json();
		
		// Transform experiences to works format
		const works = data.experiences.map(exp => ({
			id: exp.title.toLowerCase().replace(/\s+/g, '-'),
			title: exp.title,
			subtitle: exp.subtitle,
			term: exp.term,
			short_description: exp.short_description,
			long_description: exp.long_description,
			highlights: exp.highlights || [],
			skills: exp.tags || [],
			tags: exp.tags || [],
			links: exp.links || [],
			link_images: exp.link_images || [],
			images: exp.images || [],
			experience_type: exp.experience_type
		}));
		
		return works;
	} catch (error) {
		console.error('Error loading experiences:', error);
		return defaultWorks;
	}
}

// Export default works for server-side rendering
export default defaultWorks;

// Export the fetch function for client-side loading
export { fetchExperiences, type Work };

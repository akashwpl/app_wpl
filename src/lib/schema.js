
const User = {
    name: 'yash',
    username: 'yashusername',
    email: 'yash@gmail.com',
    role: ['user', 'sponsor', 'admin'],
    kyc_status: ['verified', 'unverified'],
    socials: [
        {name: 'twitter', link: 'https://twitter.com/yash'},
        {name: 'linkedin', link: 'https://linkedin.com/yash'},
        {name: 'github', link: 'http://github.com'},
        {name: 'discord', link: 'http://discord.com'},
        {name: 'telegram', link: 'http://telegram.com'}
    ],
    wallet_address: '0x1234567890',
    bio: 'I am a software developer',
    profile_picture: 'https://www.google.com',
    job_preferences: ["Full-time", "Part-time", "Remote", "On-site"],
    skills: ['React', 'Node', 'Express', 'MongoDB', 'Solidity', 'Web3'],
    total_earned: 1000,
    participated_projects: 10,
    completed_projects: 5,
    ongoing_projects: 5,
    projects: {
        in_progress: [Project],
        in_review: [Project],
        completed: [Project],
    },
}

const Project = {
    title: 'Project title',
    organisation_handle: "org_handle",
    description: 'Project description',
    logo: 'https://www.google.com',
    socials: [
        {name: 'twitter', link: 'https://twitter.com/yash'},
        {name: 'linkedin', link: 'https://linkedin.com/yash'},
        {name: 'github', link: 'http://github.com'},
        {name: 'discord', link: 'http://discord.com'},
        {name: 'telegram', link: 'http://telegram.com'}
    ],
    project_details: "Project details",
    project_status: ['idle', 'completed'],
    total_prize: 100,
    project_deadline: Date,
    submissions_count: 10,
    type: ['sample', 'bounty', 'project'],
    milestones: [Milestone]
}

const Milestone = {
    title: "Milestone title",
    description: "Milestone description",
    prize: 10,
    help_link: 'https://www.google.com',
    status: ['idle', 'in_progress', 'in_review', 'completed'],
    starts_in: Date,
    delivery_time: Date,
    project_id: 'project_id',
    user_id: 'user_id',
}
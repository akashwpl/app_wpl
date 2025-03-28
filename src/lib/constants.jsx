export const BASE_URL = "https://api.thewpl.xyz"

export const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const website_regex = /^(?:https?:\/\/)?(?:www\.)?(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,6}(?:\/\S*)?$/i;

export const discord_server_link_regex = /^(https?:\/\/)?(www\.)?(discord\.(gg|com)\/(invite\/)?([a-zA-Z0-9-]+))$/i;
export const telegram_channel_link_regex = /^(https?:\/\/)?(www\.)?(t\.me\/([a-zA-Z0-9_]+))$/i;

export function isValidStarkNetAddress(address) {
  // Check if the address starts with '0x'
  if (!address.startsWith('0x')) {
    return false;
  }

  // Remove the '0x' prefix
  const addressWithoutPrefix = address.slice(2);

  // Check if the rest of the address is a valid hexadecimal string
  const hexRegex = /^[0-9a-fA-F]+$/;
  if (!hexRegex.test(addressWithoutPrefix)) {
    return false;
  }

  // Check if the address length is valid
  if (addressWithoutPrefix.length > 64 || addressWithoutPrefix.length === 0) {
    return false;
  }

  return true;
}

export const isValidLink = (link) => {
 const regex = /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/.*)?$/;
  return regex.test(link);
}

export function getTimestampFromNow(deliveryTime, timeUnit, starts_in) {
    // const [number, unit] = input.split(' '); // Split the input into number and unit
    const duration = parseInt(deliveryTime, 10); // Convert the number to an integer
    // const now = new Date(); // Get the current date
    const now = new Date(starts_in)

    switch (timeUnit?.toLowerCase()) {
        case 'day':
        case 'days':
            now.setDate(now.getDate() + duration);
            break;
        case 'week':
        case 'weeks':
            now.setDate(now.getDate() + duration * 7); // 7 days in a week
            break;
        case 'month':
        case 'months':
            now.setMonth(now.getMonth() + duration);
            break;
        default:
            throw new Error('Invalid time unit. Please use "day", "week", or "month".');
    }

    return now.getTime(); // Return the timestamp in milliseconds
}

export const calcDaysUntilDate = (startDate, futureDate) => {
    const startDateObj = new Date(startDate);
    
    const differenceInMilliseconds = new Date(futureDate) - startDateObj;
    const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));

    // if (differenceInDays%30 == 0) {
    //     return { timeUnit: 'Months', deliveryTime: Math.floor(differenceInDays / 30) };
    // } else 
    if (differenceInDays%7 == 0) {
        return { timeUnit: 'Weeks', deliveryTime: Math.floor(differenceInDays / 7) };
    } else {
        return { timeUnit: 'Days', deliveryTime: differenceInDays };
    }
}

export function calculateRemainingDaysAndHours(startDate, targetDate) {
    // Create a Date object for the target date
    const targetDateTime = new Date(targetDate);
  
    // Get the current time
    const currentTime = new Date(startDate);
  
    // Calculate the time difference in milliseconds
    const timeDifferenceMs = targetDateTime - currentTime;
  
    // Convert milliseconds to seconds, minutes, hours, and days
    const timeDifferenceSeconds = Math.floor(timeDifferenceMs / 1000);
    const timeDifferenceMinutes = Math.floor(timeDifferenceSeconds / 60);
    const timeDifferenceHours = Math.floor(timeDifferenceMinutes / 60);
    const timeDifferenceDays = Math.floor(timeDifferenceHours / 24);   
  
  
    // Calculate remaining hours after accounting for days
    const remainingHours = timeDifferenceHours % 24;
  
    return {
      days: timeDifferenceDays,
      hours: remainingHours
    };
}

export function calculateRemainingDaysHoursAndMinutes(startDate, targetDate) {
  // Create a Date object for the target date
  const targetDateTime = new Date(targetDate);

  // Get the current time
  const currentTime = new Date(startDate);

  // Calculate the time difference in milliseconds
  const timeDifferenceMs = targetDateTime - currentTime;

  // Ensure the target date is in the future
  if (timeDifferenceMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
    };
  }
  
    // Convert milliseconds to seconds, minutes, hours, and days
    const timeDifferenceSeconds = Math.floor(timeDifferenceMs / 1000);
    const timeDifferenceMinutes = Math.floor(timeDifferenceSeconds / 60);
    const timeDifferenceHours = Math.floor(timeDifferenceMinutes / 60);
    const timeDifferenceDays = Math.floor(timeDifferenceHours / 24);
  
    // Calculate remaining hours after accounting for days
    const remainingHours = timeDifferenceHours % 24;
  
    // Calculate remaining minutes after accounting for hours
    const remainingMinutes = timeDifferenceMinutes % 60;
  
    return {
      days: timeDifferenceDays,
      hours: remainingHours,
      minutes: remainingMinutes,
    };
}

export function convertTimestampToDate(timestamp) {
  const date = new Date(timestamp);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

export const generateUsername = (name) => {
  let username;
  if (!name) {
    username = `wpl_user_${Math.floor(Math.random() * 1000)}`; 
  } else {
    username = name.replace(/\s+/g, '').toLowerCase(); 
    username = username.replace(/[^a-zA-Z0-9_]/g, ''); 
  }
  return username;
} 

export const ROLES = [
  "Backend Developer",
  "Smart contract / blockchain",
  "Frontend Developer",
  "Design",
  "Content writing",
  "Social",
  "Video",
  "Research",
]

export const SKILLS = [
  "Frontend",
  "Backend",
  "Fullstack",
  "DevOps",
  "Data Science",
  "Machine Learning",
  "Software Development",
  "QA",
  "UI/UX",
  "Project Management",
  "Business Analysis",
]

export const SIGNUP_CHOICE = 'SIGNUP_CHOICE'
export const APPLY_AS_CHOICE = 'APPLY_AS_CHOICE'
export const PROFILE_DETAILS_CHOICE = 'PROFILE_DETAILS_CHOICE'

export const BOUNTY_TEMPLATES = {
  deep_dive:
  {
    title: "Deep Dive Content Writing Bounty: Mastering Layer 2 Scaling",
    about: "We are 'Scale Innovators', a decentralized educational platform dedicated to advancing knowledge about blockchain scaling solutions. Our mission is to demystify complex concepts for a global audience, fostering a community of informed and engaged blockchain enthusiasts. We believe in the power of open-source knowledge and collaborative learning to drive the adoption of scalable blockchain technologies.",
    description: "We need a comprehensive, 5000+ word deep dive article that explores the intricacies of Layer 2 scaling solutions for Ethereum. This article should cover topics like Rollups (Optimistic and ZK), Sidechains, and State Channels, explaining their mechanisms, trade-offs, and real-world applications. The content should be technically accurate yet accessible to a broad audience, including developers and non-technical enthusiasts. Research must be thorough, citing relevant sources, and the writing should be engaging and insightful, providing a clear understanding of the current state and future potential of Layer 2 scaling. Visual aids, like diagrams and infographics, are highly encouraged to enhance comprehension.",
    roles: ["Content writing", "Research"],
  },
  ui_ux_review:
  {
    title: "UI/UX Review Bounty: Enhancing the Decentralized Exchange Interface",
    about: "We are 'SwapFlow', a community-driven project building a next-generation decentralized exchange (DEX). We prioritize user experience and strive to create a platform that is both powerful and intuitive. We are committed to fostering a transparent and accessible trading environment for everyone.",
    description: "We are seeking a detailed UI/UX review of our current DEX interface. The review should focus on identifying pain points and suggesting improvements related to navigation, usability, and overall user flow. Specific areas of focus include the trading interface, wallet integration, and asset management. Participants should provide actionable recommendations based on established UI/UX principles, including wireframes or mockups to illustrate their suggestions. The review should also consider accessibility guidelines and provide feedback on how to make the platform more inclusive. A comprehensive report with detailed findings and recommendations is expected.",
    roles: ["Design", "Frontend Developer"],
  },
  product_feedback:
  {
    title: "Product Feedback Bounty: Beta Testing our NFT Marketplace",
    about: "We are 'ArtisanBlock', a startup developing a cutting-edge NFT marketplace for digital artists. We are passionate about empowering creators and building a vibrant ecosystem for digital art. We value user feedback and believe in iterating based on community input.",
    description: "We are launching a beta version of our NFT marketplace and need thorough feedback from early adopters. Participants will test the platform's core functionalities, including browsing NFTs, creating listings, bidding, and completing transactions. Feedback should focus on identifying bugs, usability issues, and areas for improvement. Participants should also provide insights into their overall experience, including the platform's design, performance, and features. Constructive criticism and suggestions for new features are highly encouraged. A detailed report summarizing the findings is expected.",
    roles: ["Research"],
  },
  twitter_thread:
  {
    title: "Twitter Thread Bounty: Exploring the Future of Decentralized Identity",
    about: "We are 'IdentityVerse', a research group exploring the potential of decentralized identity solutions. We aim to educate the public about the importance of self-sovereign identity and its implications for privacy and security. We believe in the power of social media to spread awareness and spark conversations.",
    description: "Create a compelling and informative Twitter thread (8-10 tweets) that explores the future of decentralized identity. The thread should cover topics like self-sovereign identity, verifiable credentials, and their potential applications in various industries. The content should be engaging and accessible to a broad audience, using visuals and concise language to convey complex concepts. The thread should also include relevant hashtags and encourage interaction from the community. We are looking for individuals with a strong understanding of decentralized identity and the ability to communicate effectively on social media.",
    roles: ["Social", "Content writing"],
  },
};

export const PROJECT_TEMPLATES = {
  frontend_dev:
    {
      title: "React-based E-commerce Platform",
      about: "We are 'WebCraft', a startup dedicated to building modern and scalable web applications. Our mission is to empower businesses with cutting-edge technology and user-centric design.",
      description: "Develop a fully functional e-commerce platform using React. The platform should include features like product listings, shopping cart, user authentication, and payment integration. The project should be responsive and optimized for performance.",
      roles: ["Frontend Developer", "Backend Developer", "Design"],
      milestones: [
        {
          title: "Milestone 1: Setup and Product Listings",
          description: "Initialize the React project using Create React App or a similar tool, including folder structure and initial component setup. Configure routing with React Router to enable navigation between different pages such as the home page, product listing, and product details. Implement the product listing page, fetching product data from a mock API or a backend service. Display product images, titles, prices, and detailed descriptions. Add basic filtering options (e.g., by category, price range) and sorting options (e.g., by price, popularity, rating). Ensure the product listing page is responsive across various screen sizes and visually appealing with a clean and consistent design."
        },
        {
          title: "Milestone 2: Shopping Cart and User Authentication",
          description: "Implement the shopping cart functionality, allowing users to add, remove, and update items in their cart. Store cart data in local storage or a state management solution (e.g., Redux, Context API) to persist data across sessions. Implement user authentication (login/signup) using Firebase Authentication, Auth0, or a custom backend service, including secure password hashing and session management. Create protected routes to restrict access to certain pages (e.g., checkout, user profile) for authenticated users only, ensuring data security and user privacy."
        },
        {
          title: "Milestone 3: Payment Integration and Order Management",
          description: "Integrate a payment gateway like Stripe or PayPal to process payments securely, including handling payment errors and success confirmations. Implement the checkout process, allowing users to enter their shipping and billing information, review their order, and complete the payment. Generate order confirmations and store order details in a database, including order status, items purchased, and payment details. Implement order management functionality for administrators, allowing them to view, update, and manage orders. Display order history for users, enabling them to track their past purchases."
        },
        {
          title: "Milestone 4: Testing, Optimization, and Deployment",
          description: "Write comprehensive unit tests and integration tests using Jest and React Testing Library to ensure the application's functionality and prevent regressions. Conduct thorough cross-browser testing to verify compatibility across different browsers and devices. Optimize performance by implementing lazy loading for images, minimizing bundle size through code splitting, and optimizing rendering performance. Deploy the application to a hosting platform like Netlify, Vercel, or AWS Amplify, configuring a CI/CD pipeline for automated deployments to streamline the release process and ensure continuous integration."
        }
      ]
    },
  android_app_dev:
    {
      title: "Android Mobile App for Task Management",
      about: "We are 'AppForge', a mobile app development company focused on creating intuitive and efficient productivity tools. We believe in simplifying daily tasks through innovative mobile solutions.",
      description: "Develop an Android application for task management. The app should allow users to create, manage, and track tasks, set reminders, and categorize tasks. The app should have a clean and user-friendly interface.",
      roles: ["Android Developer", "Design"],
      milestones: [
        {
          title: "Milestone 1: Project Setup and Task Creation",
          description: "Set up the Android project using Android Studio and Kotlin or Java, including project dependencies and initial UI layouts. Design the UI for task creation using XML or Jetpack Compose, ensuring a user-friendly and intuitive design. Implement the functionality to add new tasks, including title, detailed description, due date, and priority level. Store task data in a local database using Room or Shared Preferences, ensuring data persistence. Implement input validation to ensure data integrity, preventing invalid or incomplete task entries."
        },
        {
          title: "Milestone 2: Task Management and Categorization",
          description: "Implement features to manage tasks, allowing users to edit, delete, and mark tasks as completed, providing a seamless task management experience. Display tasks in a list view or a RecyclerView, ensuring efficient scrolling and data presentation. Implement task categorization based on priority or category, allowing users to filter and sort tasks based on their preferences. Implement search functionality to find specific tasks quickly, enhancing user productivity."
        },
        {
          title: "Milestone 3: Reminders and Notifications",
          description: "Integrate reminder functionality using AlarmManager or WorkManager, allowing users to set reminders for upcoming tasks. Implement push notifications using Firebase Cloud Messaging (FCM) to notify users about upcoming tasks, even when the app is in the background. Allow users to customize reminder settings and notification preferences, ensuring a personalized experience. Implement a background service to handle reminders and notifications, ensuring reliable and timely delivery."
        },
        {
          title: "Milestone 4: Testing, Optimization, and Deployment",
          description: "Write comprehensive unit tests and UI tests using JUnit and Espresso to ensure the app's functionality and prevent regressions. Conduct thorough testing on different Android devices and versions to ensure compatibility and performance. Optimize performance by minimizing memory usage, reducing network requests, and improving UI responsiveness, ensuring a smooth user experience. Deploy the app to the Google Play Store, following the submission guidelines and optimizing for app store visibility."
        }
      ]
    },
  blockchain_full_stack:
    {
      title: "Decentralized Social Media Platform",
      about: "We are 'BlockSocial', a community-driven project building a decentralized social media platform on the blockchain. We prioritize user privacy and data ownership.",
      description: "Develop a full-stack decentralized social media platform using blockchain technology. The platform should allow users to create profiles, post content, follow other users, and interact with posts. The project should utilize smart contracts for data storage and user interactions.",
      roles: ["Smart contract / blockchain", "Full Stack Developer", "Frontend Developer", "Design"],
      milestones: [
        {
          title: "Milestone 1: Smart Contract Development and Deployment",
          description: "Develop and deploy the smart contracts for user profiles, posts, and interactions using Solidity, ensuring secure and efficient data storage. Implement functions for creating profiles, posting content, following users, and interacting with posts (like, comment), ensuring a robust and feature-rich platform. Deploy the smart contracts to a testnet or mainnet using Truffle or Hardhat, ensuring a smooth and reliable deployment process. Ensure the smart contracts are secure and optimized for gas efficiency, minimizing transaction costs for users."
        },
        {
          title: "Milestone 2: Backend Development and API Integration",
          description: "Develop a backend API using Node.js, Express.js, or a similar framework to interact with the smart contracts, providing a seamless interface between the frontend and the blockchain. Implement endpoints for data retrieval and storage, handling user authentication, and managing blockchain interactions, ensuring a secure and efficient backend. Integrate with a web3 library (e.g., Web3.js, Ethers.js) to communicate with the Ethereum blockchain, enabling smooth interaction with smart contracts. Implement a database to store user data and metadata, enhancing data management and retrieval."
        },
        {
          title: "Milestone 3: Frontend Development and UI Implementation",
          description: "Develop the frontend UI using React or Vue.js and integrate with the backend API and smart contracts, ensuring a responsive and user-friendly interface. Implement user profile pages, content feeds, and interaction components, providing a rich and engaging user experience. Use a web3 provider (e.g., MetaMask) to connect to the user's wallet, enabling seamless interaction with the blockchain. Ensure the UI is responsive and user-friendly across different devices and screen sizes."
        },
        {
          title: "Milestone 4: Testing, Security Audit, and Deployment",
          description: "Conduct thorough testing of the smart contracts, backend API, and frontend UI, ensuring a robust and reliable platform. Perform a security audit to identify and fix vulnerabilities, safeguarding user data and platform integrity. Deploy the platform to a decentralized hosting platform like IPFS or Arweave, ensuring censorship resistance and data permanence. Configure a CI/CD pipeline for automated deployments, streamlining the release process and ensuring continuous integration. Implement monitoring and logging to track platform performance, enabling proactive issue resolution."
        }
      ]
    },
  hype_video:
    {
      title: "Hype Video for a New Product Launch",
      about: "We are 'Visionary Labs', a creative agency specializing in producing high-impact video content for product launches. We believe in the power of visual storytelling to captivate audiences.",
      description: "Create a high-energy hype video for the launch of our new product. The video should showcase the product's features, benefits, and unique selling points in an engaging and visually appealing way. The video should be suitable for social media and marketing campaigns.",
      roles: ["Video", "Design", "Social"],
      milestones: [
        {
          title: "Milestone 1: Concept Development and Storyboarding",
          description: "Develop a compelling concept for the hype video that aligns with the product's brand and target audience. Conduct market research and competitor analysis to identify unique selling points and key messaging. Create a detailed storyboard outlining the video's sequence, visuals, and audio, including scene descriptions, camera angles, and transitions. Finalize the script, incorporating key messages, a clear call to action, and engaging dialogue or narration. Select appropriate music and sound effects that complement the video's tone and style. Present the concept, storyboard, and script for client approval."
        },
        {
          title: "Milestone 2: Filming and Production",
          description: "Plan and execute the filming, capturing high-quality footage of the product, its features, and its benefits. Organize and manage filming locations, equipment, and talent, ensuring a smooth and efficient production process. Capture diverse footage, including product demonstrations, user testimonials, and lifestyle shots. Gather necessary assets, including product images, logos, graphics, and any pre-existing footage. Ensure consistent lighting and sound quality throughout the filming process. Manage on-set logistics and troubleshoot any technical issues that may arise."
        },
        {
          title: "Milestone 3: Editing and Post-Production",
          description: "Edit the footage using professional video editing software (e.g., Adobe Premiere Pro, Final Cut Pro), assembling the scenes according to the storyboard. Add visual effects, motion graphics, and text overlays to enhance the video's impact and convey key messages. Incorporate the selected music and sound effects, ensuring a seamless and engaging audio experience. Color grade the footage to achieve a consistent and visually appealing look, enhancing the overall aesthetic. Create multiple versions of the video optimized for different platforms and aspect ratios. Review the edited video and make any necessary revisions based on client feedback."
        },
        {
          title: "Milestone 4: Finalization and Distribution",
          description: "Finalize the video, ensuring all elements are polished and error-free. Optimize the video for different platforms (e.g., YouTube, Instagram, TikTok), ensuring correct aspect ratios, file formats, and compression settings. Create a short teaser or trailer for social media promotion to generate buzz and anticipation. Prepare the video for distribution, including uploading to relevant platforms, scheduling posts, and creating captions and descriptions. Implement a distribution strategy to maximize reach and engagement, including paid advertising and influencer marketing. Track video performance and engagement metrics, analyzing views, shares, comments, and click-through rates. Generate a post-launch report summarizing the video's performance and impact."
        }
      ]
    }
}
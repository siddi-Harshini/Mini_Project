// Chatbot functionality
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotContainer = document.getElementById('chatbot-container');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotInput = document.getElementById('chatbot-input-field');
const chatbotSend = document.getElementById('chatbot-send');
const chatbotMessages = document.getElementById('chatbot-messages');

// Toggle chatbot
if (chatbotToggle) {
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.style.display = chatbotContainer.style.display === 'none' ? 'flex' : 'none';
    });
}

if (chatbotClose) {
    chatbotClose.addEventListener('click', () => {
        chatbotContainer.style.display = 'none';
    });
}

// Send message
function sendMessage() {
    const message = chatbotInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    chatbotInput.value = '';
    
    // Get bot response
    setTimeout(() => {
        const response = getBotResponse(message);
        addMessage(response, 'bot');
    }, 500);
}

if (chatbotSend) {
    chatbotSend.addEventListener('click', sendMessage);
}

if (chatbotInput) {
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Simple chatbot responses
function getBotResponse(message) {
    const msg = message.toLowerCase();
    
    // Greetings
    if (msg.match(/\b(hi|hello|hey)\b/)) {
        return "Hello! I'm here to help you find scholarships and programs. You can ask me about deadlines, eligibility criteria, or how to use the platform. What would you like to know?";
    }
    
    // Scholarships
    if (msg.match(/\b(scholarship|scholarships)\b/)) {
        if (msg.match(/\b(how|find|search|apply)\b/)) {
            return "To find scholarships: 1) Complete your profile with your CGPA, skills, and interests. 2) Visit the 'My Matches' tab to see scholarships you're eligible for. 3) Check the 'All Opportunities' tab to browse all available scholarships. You can filter by deadline!";
        }
        if (msg.match(/\b(eligible|eligibility|qualify)\b/)) {
            return "Scholarship eligibility is based on your profile: gender, CGPA, year of study, department, skills, and interests. Complete your profile to get personalized matches automatically!";
        }
        return "We have various scholarships available! You can view all scholarships in the 'All Opportunities' tab, or see your personalized matches in 'My Matches' based on your profile.";
    }
    
    // Programs
    if (msg.match(/\b(program|programs|internship|hackathon|fellowship)\b/)) {
        if (msg.match(/\b(type|types|kind)\b/)) {
            return "We have several program types: Internships, Fellowships, Ambassador Programs, Hackathons, Conferences, and Coding Events. You can filter by type in the 'All Opportunities' tab!";
        }
        return "Programs include internships, hackathons, fellowships, and more! Check your personalized matches in the 'My Matches' tab or browse all programs in 'All Opportunities'. Filter by type to find exactly what you're looking for!";
    }
    
    // Deadlines
    if (msg.match(/\b(deadline|urgent|time|when|date)\b/)) {
        return "You can sort opportunities by deadline to see the most urgent ones first! Scholarships and programs with deadlines within 30 days are marked with ⚠️. Check the 'My Matches' tab to see your urgent eligible opportunities.";
    }
    
    // Profile
    if (msg.match(/\b(profile|update|edit|change)\b/)) {
        return "To update your profile, click on 'Profile' in the navigation menu. Make sure to add your CGPA, skills, interests, and other details to get better personalized matches for scholarships and programs!";
    }
    
    // How it works
    if (msg.match(/\b(how|work|use|start)\b/)) {
        return "Here's how to use ScholarMatch: 1) Complete your profile with accurate information. 2) Visit 'My Matches' to see opportunities you're eligible for. 3) Browse 'All Opportunities' to discover more. 4) Apply directly through the provided links. The platform automatically matches you based on your profile!";
    }
    
    // Eligibility
    if (msg.match(/\b(eligible|match|personalized|filter)\b/)) {
        return "Your eligible matches are calculated based on your profile data: gender, CGPA, year, department, skills, and interests. The system automatically filters opportunities that match your criteria. Keep your profile updated for best results!";
    }
    
    // Google programs
    if (msg.match(/\b(google)\b/)) {
        return "Popular Google programs include: Google STEP Internship, Google Summer of Code (GSoC), and Google Developer Student Clubs (GDSC). Check the Programs section and filter by provider to see Google opportunities!";
    }
    
    // Women programs
    if (msg.match(/\b(women|female|girl)\b/)) {
        return "We have many programs specifically for women in tech! Look for: Girlscript Summer of Code, Outreachy, Grace Hopper Celebration, WomenTechmakers, and more. These are automatically shown in your matches if you've updated your profile!";
    }
    
    // Help
    if (msg.match(/\b(help|support|confused)\b/)) {
        return "I'm here to help! You can ask me about: finding scholarships, program types, deadlines, eligibility criteria, how to update your profile, or how the platform works. What specific question do you have?";
    }
    
    // Default response
    return "I'm here to help with questions about scholarships and programs! You can ask me about eligibility, deadlines, program types, or how to use the platform. What would you like to know?";
}

// Pre-populate some helpful questions as buttons
function addQuickQuestions() {
    const questions = [
        "How do I find scholarships?",
        "What program types are available?",
        "How does eligibility matching work?",
        "How do I update my profile?"
    ];
    
    const quickQuestionsDiv = document.createElement('div');
    quickQuestionsDiv.className = 'bot-message';
    quickQuestionsDiv.innerHTML = `
        <p>Quick questions:</p>
        ${questions.map(q => `
            <button style="margin: 0.25rem; padding: 0.5rem; background: var(--primary-color); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem;" onclick="askQuestion('${q}')">
                ${q}
            </button>
        `).join('')}
    `;
    
    if (chatbotMessages && chatbotMessages.children.length === 1) {
        chatbotMessages.appendChild(quickQuestionsDiv);
    }
}

function askQuestion(question) {
    chatbotInput.value = question;
    sendMessage();
}

// Initialize quick questions after a short delay
setTimeout(addQuickQuestions, 1000);

// Simple heuristic-based AI for demo purposes
// In a real app, this would call an LLM API

interface Suggestion {
    content: string;
}

const COMMON_TASKS: Record<string, string[]> = {
    'pack': ['Clothes', 'Toiletries', 'Chargers', 'Documents', 'Medication'],
    'trip': ['Book flights', 'Book hotel', 'Pack bags', 'Check in', 'Arrange transport'],
    'grocer': ['Milk', 'Eggs', 'Bread', 'Vegetables', 'Fruit'],
    'shop': ['Milk', 'Eggs', 'Bread', 'Vegetables', 'Fruit'],
    'project': ['Define scope', 'Research', 'Design', 'Implement', 'Test', 'Deploy'],
    'meeting': ['Prepare agenda', 'Send invites', 'Prepare slides', 'Write minutes'],
    'clean': ['Living room', 'Kitchen', 'Bathroom', 'Bedroom', 'Take out trash'],
    'study': ['Read chapter', 'Take notes', 'Review flashcards', 'Practice problems'],
    'workout': ['Warm up', 'Cardio', 'Strength training', 'Cool down', 'Stretch'],
};

export const generateSubtasks = async (taskContent: string): Promise<Suggestion[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerContent = taskContent.toLowerCase();

    for (const [keyword, subtasks] of Object.entries(COMMON_TASKS)) {
        if (lowerContent.includes(keyword)) {
            return subtasks.map(content => ({ content }));
        }
    }

    // Default suggestions if no keywords match
    return [
        { content: 'Step 1' },
        { content: 'Step 2' },
        { content: 'Review' },
    ];
};

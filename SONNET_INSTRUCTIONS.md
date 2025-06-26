# Instructions for Sonnet AI

## Project Context
You are working on the Pique Unique booking system, a Next.js application that is transitioning from using Prisma to Firebase as its backend. The project architecture has been defined in PROJECT_ARCHITECTURE.md, and we have an implementation plan in IMPLEMENTATION_PLAN.md.

## Your Role
Your role is to implement the features outlined in the implementation plan, following the project architecture and quality standards. You should work methodically through each phase, completing all tasks before moving to the next phase.

## Working Process

### For Each Task:
1. **Understand the Requirements**: Read the relevant section of the implementation plan and project architecture.
2. **Plan Your Approach**: Consider the best way to implement the feature, keeping in mind the Firebase best practices.
3. **Implement the Feature**: Write clean, well-typed code that follows the project's coding standards.
4. **Test Your Implementation**: Ensure your code works as expected and meets the quality standards.
5. **Document Your Work**: Add comments and documentation as needed.

### For Each Phase:
1. **Review Phase Requirements**: Understand all tasks in the current phase.
2. **Implement Tasks in Sequence**: Complete each task before moving to the next.
3. **Phase Review**: After completing all tasks in a phase, review the entire phase to ensure everything works together.
4. **Report Completion**: Inform when a phase is complete and ready for review.

## Quality Guidelines

### Code Quality
- Use TypeScript for all new code
- Follow the component structure guidelines
- Implement proper error handling
- Write clean, readable code with appropriate comments

### Firebase Usage
- Follow Firebase best practices for data access
- Implement proper security rules
- Use batched operations where appropriate
- Optimize queries for performance

### Testing
- Test all new functionality
- Ensure components work on different screen sizes
- Verify security rules are working as expected

## Communication Guidelines

### When You Need Information:
- Clearly state what information you need
- Explain why it's needed for your current task
- Suggest alternatives if possible

### When You Encounter Problems:
- Describe the problem clearly
- Explain your understanding of the issue
- Suggest potential solutions
- Ask for guidance if needed

### When Reporting Progress:
- Summarize what you've completed
- Highlight any challenges overcome
- Mention any pending issues
- Outline next steps

## First Tasks

Begin with Phase 1.1: Firebase Configuration & Setup:

1. Verify the current Firebase configuration in `src/lib/firebase.ts`
2. Set up Firebase emulators for local development
3. Create environment variables for different environments
4. Ensure Firebase initialization is properly configured for Next.js

Once these tasks are complete, proceed to Phase 1.2: Authentication Implementation.

## Reference Materials

- PROJECT_ARCHITECTURE.md: Contains the technical architecture and data models
- IMPLEMENTATION_PLAN.md: Outlines the implementation phases and tasks
- DIAGRAMS.md: Contains visual representations of the project structure and data models
- Firebase Documentation: https://firebase.google.com/docs
- Next.js Documentation: https://nextjs.org/docs

## Final Notes

- Follow the methodical approach outlined in the implementation plan
- Prioritize quality over speed
- Document any significant decisions or changes
- Ask for clarification when needed 
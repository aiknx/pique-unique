# Development Guidelines

## Core Principles

1. **Follow Instructions Precisely**
   - Always read relevant memory/instructions before ANY action
   - Follow the exact order specified
   - NEVER improvise or add extra steps
   - If unsure - ASK, don't guess

2. **Process Management**
   - Firebase emulators MUST be started in a NEW TERMINAL
   - Setup-dev script MUST be started in a NEW TERMINAL
   - NEVER start processes through the conversation
   - Working directory must be /home/techlift/pique-unique for all processes

3. **Focus and Clarity**
   - Complete current task before moving to next
   - Verify understanding before proceeding
   - Keep track of current context
   - No multitasking or parallel actions

4. **Error Prevention**
   - Double-check instructions before execution
   - Verify prerequisites are met
   - Follow established patterns
   - Document new patterns when discovered

## Development Process

1. **Starting Development Environment**
   ```bash
   # 1. Start Firebase emulators in NEW TERMINAL
   firebase emulators:start

   # 2. Run setup-dev in NEW TERMINAL
   npm run setup-dev

   # 3. Start Next.js dev server
   npm run dev
   ```

2. **Making Changes**
   - Follow task list in order
   - Complete one task fully before moving to next
   - Test changes before proceeding
   - Document any new processes

## Common Pitfalls to Avoid

1. Don't start processes in conversation
2. Don't improvise or add extra steps
3. Don't multitask between different tasks
4. Don't assume - always verify
5. Don't skip verification steps 
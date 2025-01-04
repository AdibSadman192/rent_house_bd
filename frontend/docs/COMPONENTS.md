# Frontend Components Documentation

## Core Components

### Layout Components

#### `Layout`
The main layout wrapper component that provides consistent structure across pages.

**Props:**
- `children`: React nodes to render within the layout
- `showHeader`: Boolean to control header visibility
- `showFooter`: Boolean to control footer visibility

#### `Header`
Main navigation header with responsive design.

**Features:**
- Responsive navigation menu
- User authentication status
- Search functionality
- Notifications

#### `Footer`
Site footer with links and information.

### Authentication Components

#### `LoginForm`
Handles user login with email/password.

**Props:**
- `onSuccess`: Callback function after successful login
- `redirectTo`: Path to redirect after login

#### `RegisterForm`
User registration form with validation.

**Props:**
- `onSuccess`: Callback function after successful registration
- `userType`: Type of user registration (tenant/owner)

### Property Components

#### `PropertyCard`
Displays property information in a card format.

**Props:**
- `property`: Property object with details
- `onClick`: Click handler function
- `showActions`: Boolean to control action buttons

#### `PropertySearch`
Advanced property search component with filters.

**Props:**
- `initialFilters`: Initial filter state
- `onSearch`: Search callback function

#### `PropertyDetails`
Detailed view of a property with all information.

**Props:**
- `propertyId`: ID of the property to display
- `isEditable`: Boolean for edit permissions

### User Components

#### `UserProfile`
User profile display and edit component.

**Props:**
- `userId`: ID of the user
- `isEditable`: Boolean for edit permissions

#### `UserBookings`
Displays user's property bookings.

**Props:**
- `userId`: ID of the user
- `status`: Filter bookings by status

### Chat Components

#### `ChatWindow`
Real-time chat interface component.

**Props:**
- `conversationId`: ID of the chat conversation
- `participants`: Array of user IDs in conversation

#### `MessageList`
Displays chat messages with infinite scroll.

**Props:**
- `messages`: Array of message objects
- `onLoadMore`: Callback for loading more messages

### Common Components

#### `Button`
Reusable button component with variants.

**Props:**
- `variant`: Button style variant
- `size`: Button size
- `disabled`: Disabled state
- `loading`: Loading state

#### `Input`
Form input component with validation.

**Props:**
- `type`: Input type
- `label`: Input label
- `error`: Error message
- `validation`: Validation rules

#### `Modal`
Reusable modal dialog component.

**Props:**
- `isOpen`: Boolean to control visibility
- `onClose`: Close handler function
- `title`: Modal title

## Utility Components

### `ErrorBoundary`
Catches and handles React component errors.

### `LoadingSpinner`
Loading indicator component.

### `ImageGallery`
Image gallery with zoom and carousel.

## Custom Hooks

### `useAuth`
Authentication state and methods.

### `useProperty`
Property data fetching and manipulation.

### `useChat`
Real-time chat functionality.

## State Management

### Redux Slices
- `authSlice`: Authentication state
- `propertySlice`: Property data
- `chatSlice`: Chat state
- `uiSlice`: UI state

## Component Best Practices

1. Use TypeScript for better type safety
2. Implement proper error boundaries
3. Use React.memo for performance optimization
4. Follow accessibility guidelines
5. Write unit tests for components
6. Use proper prop validation
7. Implement loading and error states
8. Follow consistent naming conventions
9. Use CSS modules for styling
10. Document component APIs

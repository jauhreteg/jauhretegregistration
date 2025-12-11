# Jauhr E Teg Registration System

A comprehensive web application for managing team registrations for the Jauhr E Teg Sikh martial arts competition. Built with Next.js, TypeScript, and Supabase, this system handles the complete registration lifecycle from initial team submission to administrative approval.

## Overview

The Jauhr E Teg Registration System is a full-stack application designed to streamline the registration process for teams participating in traditional Sikh martial arts competitions. The system supports multi-ustad team structures, comprehensive data collection, administrative workflows, and automated document generation.

## Core Features

### Registration Management

- **Multi-Step Registration Process**: Guided form with division selection, player information, team details, and document uploads
- **Multiple Ustad Support**: Teams can register with up to 5 ustads (spiritual guides/coaches) with full contact information
- **Dynamic Validation**: Real-time form validation with comprehensive error handling and user feedback
- **Token-Based Access**: Secure registration tokens (format: jet-YYYY-XXXXX) for team access and editing
- **File Upload System**: Support for team photos, age proof documents, and other required documentation

### Administrative Dashboard

- **Registration Overview**: Complete dashboard with statistics, filtering, and search capabilities
- **Advanced Search**: Search by team name, ustad names/emails, coach information, and registration details
- **Status Management**: Track registrations through multiple states (pending, approved, information requested, archived)
- **Bulk Operations**: Export registration data to CSV format with customizable column selection
- **Real-time Updates**: Live notifications and data synchronization across admin interfaces

### Team Information Editing

- **User Self-Service**: Teams can edit their registration information using secure tokens
- **Conditional Updates**: Admin-controlled marking of specific fields that require user updates
- **Visual Indicators**: Clear UI feedback showing which information needs attention
- **Version Control**: Track changes and maintain audit trails for registration modifications

### Document Generation

- **PDF Export**: Professional registration summaries with complete team and player information
- **Formatted Output**: Proper ustad information display with name and email formatting
- **Admin Notes Integration**: Separate internal and public notes systems for administrative use
- **Print-Ready Layout**: Optimized formatting for physical documentation needs

### Data Management

- **JSONB Storage**: Efficient storage of complex ustad arrays with PostgreSQL JSONB columns
- **Type Safety**: Full TypeScript implementation ensuring data integrity throughout the application
- **Database Migrations**: Structured schema updates supporting feature evolution
- **Performance Optimization**: Indexed search capabilities for large datasets

## Technical Architecture

### Frontend Technology Stack

- **Next.js 16**: React framework with App Router for modern web application structure
- **TypeScript**: Full type safety across components, utilities, and data models
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Radix UI**: Accessible component primitives for consistent user interfaces
- **React Hook Form**: Efficient form state management with validation integration

### Backend Infrastructure

- **Supabase**: PostgreSQL database with real-time capabilities and authentication
- **Database Schema**: Comprehensive registration data model with JSONB columns for flexible data structures
- **API Routes**: Next.js API endpoints for secure server-side operations
- **File Storage**: Integrated file upload and management system

### Key Components

#### UstadManager

Advanced component for managing multiple ustads per team registration:

- Dynamic add/remove functionality with maximum limits
- Email uniqueness validation within team scope
- Real-time validation feedback and error handling
- Responsive design for various screen sizes

#### RegistrationDetailModal

Comprehensive administrative interface for registration management:

- Inline editing capabilities for all registration fields
- Status change workflows with audit logging
- Document viewing and management
- Admin notes system with internal and public visibility controls

#### PDFGenerator

Professional document generation system:

- Complete registration information formatting
- Proper ustad display with name and email pairs
- Administrative notes integration
- Print-optimized layout and styling

### Data Models

#### Registration Structure

Comprehensive data model supporting:

- Team information (name, location, photos)
- Multiple player profiles with complete demographic data
- Ustad information stored as JSONB arrays
- Administrative metadata and status tracking
- Document references and file management

#### Ustad Model

Structured support for spiritual guides/coaches:

```typescript
interface Ustad {
  name: string;
  email: string;
}
```

#### Administrative Notes

Dual-layer notes system:

- Internal notes for administrative use only
- Public notes visible to teams
- Requested updates tracking for specific fields

## User Workflows

### Team Registration Process

1. **Division Selection**: Choose appropriate competition division
2. **Team Information**: Enter team details, location, and ustad information
3. **Player Profiles**: Complete detailed player information including demographics and emergency contacts
4. **Document Upload**: Submit required photos and verification documents
5. **Review and Submit**: Final review before submission with comprehensive validation
6. **Token Generation**: Receive secure access token for future edits

### Administrative Management

1. **Dashboard Access**: Secure admin authentication and authorization
2. **Registration Review**: Comprehensive view of all submitted registrations
3. **Status Updates**: Manage registration approval workflow
4. **Information Requests**: Mark specific fields requiring team updates
5. **Document Generation**: Create PDF summaries and export data
6. **Communication**: Internal and public notes management

### Team Self-Service

1. **Token Access**: Secure login using registration token
2. **Information Review**: View current registration status and details
3. **Conditional Editing**: Update information marked as requiring changes
4. **Real-time Validation**: Immediate feedback on form submissions
5. **Status Tracking**: Monitor approval progress and requirements

## Security Features

### Authentication and Authorization

- **Admin Authentication**: Secure login system for administrative access
- **Token-Based Team Access**: Cryptographically secure registration tokens
- **Role-Based Permissions**: Differentiated access levels for various user types

### Data Protection

- **Input Validation**: Comprehensive server and client-side validation
- **SQL Injection Prevention**: Parameterized queries and ORM protection
- **File Upload Security**: Validated file types and secure storage
- **HTTPS Enforcement**: Encrypted data transmission

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm, yarn, pnpm, or bun package manager
- Supabase project with configured database

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd jauhretegregistration

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

### Environment Configuration

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key for admin operations

### Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint code analysis
npm run type-check   # TypeScript type checking
```

## Production Deployment

### Build Process

The application includes comprehensive build-time validation:

- TypeScript compilation with strict type checking
- ESLint code quality analysis
- Next.js optimization and bundling
- Asset optimization and compression

### Database Migrations

Structured migration system supporting:

- Schema evolution with version control
- Data transformation for feature updates
- Rollback capabilities for safe deployments
- Index optimization for performance

### Performance Considerations

- **Static Generation**: Pre-rendered pages where appropriate
- **Image Optimization**: Next.js automatic image optimization
- **Database Indexing**: Optimized queries for registration search and filtering
- **Lazy Loading**: Component-level code splitting for improved load times

## API Documentation

### Registration Endpoints

- `POST /api/registrations` - Create new registration
- `GET /api/registrations/[token]` - Retrieve registration by token
- `PUT /api/registrations/[token]` - Update existing registration
- `DELETE /api/registrations/[id]` - Admin-only registration deletion

### Administrative Endpoints

- `GET /api/admin/registrations` - List all registrations with filtering
- `PUT /api/admin/registrations/[id]/status` - Update registration status
- `POST /api/admin/export` - Generate CSV export data
- `GET /api/admin/statistics` - Dashboard statistics and metrics

## Testing and Quality Assurance

### Testing Framework

Comprehensive testing strategy including:

- Unit tests for utility functions and data transformations
- Component testing for UI interactions and validation
- Integration tests for API endpoints and database operations
- End-to-end testing for complete user workflows

### Quality Metrics

- TypeScript strict mode for compile-time error prevention
- ESLint configuration for code consistency and best practices
- Automated testing pipeline with continuous integration
- Performance monitoring and optimization tracking

## Support and Maintenance

### Error Handling

- Comprehensive error boundaries for graceful failure handling
- Detailed logging and monitoring for debugging and optimization
- User-friendly error messages with actionable guidance
- Automatic retry mechanisms for transient failures

### Monitoring and Analytics

- Performance tracking for registration completion rates
- Database query optimization and monitoring
- User experience analytics for interface improvements
- System health monitoring and alerting

This registration system represents a modern, scalable solution for managing complex team registrations with administrative oversight, user self-service capabilities, and comprehensive data management features.

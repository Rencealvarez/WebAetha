# The Aeta People of the Philippines - Immersive Museum Exhibition

## Overview

This is a comprehensive digital museum exhibition showcasing the rich cultural heritage of the Aeta indigenous people of the Philippines. The exhibition combines interactive 3D models, multimedia content, and educational materials to create an immersive learning experience that respects and accurately represents Aeta culture.

## Features

### 🏹 Traditional Artifacts Section

- **Interactive 3D Models**: Rotatable 3D representations of traditional Aeta artifacts
- **Arrow Pangal**: Broad-tipped hunting arrow with detailed descriptions
- **Bangkaw/Sibat**: Lightweight hunting spear with cultural context
- **Bahag**: Traditional male loincloth with historical significance
- **Indigenous Jewelry**: Collection of traditional adornments and their meanings

### 🎭 Living Culture Gallery

- **Performance Space**: Virtual demonstrations of traditional Aeta dances
- **Video Installations**: Cultural ceremonies and rituals
- **Interactive Displays**: Traditional musical instruments and their uses
- **Cultural Performances**: Authentic representations of Aeta cultural practices

### 🏛️ Cultural Heritage Center

- **Language Documentation**: Aeta languages and dialects (Mag-antsi, Mag-indi, Abellen)
- **Historical Timeline**: Comprehensive Aeta history and cultural evolution
- **Territorial Maps**: Traditional Aeta territories and migration patterns
- **Information Panels**:
  - Spiritual beliefs and practices
  - Annual festivals and celebrations
  - Coming-of-age rituals
  - Traditional ecological knowledge
  - Social structure and family life

## Technical Implementation

### Frontend Technologies

- **React 19**: Modern React with hooks and functional components
- **Material-UI (MUI)**: Comprehensive UI component library
- **Three.js**: 3D graphics and interactive models
- **Framer Motion**: Smooth animations and transitions
- **CSS3**: Custom styling with responsive design

### Key Components

#### Interactive3DDisplay

- 3D model rendering with Three.js
- Rotation controls and animation
- Bilingual descriptions (English/Aeta)
- Interactive controls for user engagement

#### CulturalHeritageSection

- Tabbed interface for different cultural aspects
- Responsive grid layout for information display
- Interactive cards with detailed cultural data

#### LivingCultureGallery

- Video thumbnail displays
- Modal dialogs for detailed content
- Responsive grid for cultural content

### 3D Models

All 3D models are created using Three.js primitives:

- **Arrow Pangal**: Box geometries for shaft, tip, and feathers
- **Bangkaw/Sibat**: Box geometries for spear shaft and tip
- **Bahag**: Box geometries for fabric and belt components
- **Jewelry**: Sphere geometries for necklaces and bracelets

## Cultural Sensitivity & Authenticity

### Community Consultation

- Content developed in consultation with Aeta community members
- Cultural experts and indigenous rights advocates involved
- All content reviewed for cultural accuracy

### Respectful Representation

- Accurate portrayal of Aeta traditions and practices
- Proper attribution and cultural context
- Acknowledgment of Aeta people as cultural custodians

### Language Support

- Bilingual descriptions (English and Aeta languages)
- Cultural terminology preservation
- Accessible language for various age groups

## Installation & Usage

### Prerequisites

- Node.js 18+
- npm or yarn package manager
- Modern web browser with WebGL support

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm start`
4. Navigate to `/aeta-museum` route

### Access Routes

- **Main Exhibition**: `/aeta-museum`
- **Traditional Artifacts**: `/aeta-museum#artifacts`
- **Living Culture**: `/aeta-museum#culture`
- **Cultural Heritage**: `/aeta-museum#heritage`

## Data Structure

### Cultural Information

- **Languages**: Regional dialects, speaker counts, linguistic features
- **Festivals**: Seasonal celebrations, activities, cultural significance
- **Rituals**: Life cycle ceremonies, age requirements, cultural meaning
- **Artifacts**: Materials, dimensions, cultural significance, usage

### Ecological Knowledge

- **Hunting Techniques**: Traditional methods, environmental impact
- **Medicinal Plants**: Traditional healing, sustainable harvesting
- **Seasonal Migration**: Weather patterns, resource management

### Social Structure

- **Family Networks**: Extended family systems, cultural transmission
- **Elder Leadership**: Wisdom sharing, community decision-making
- **Community Cooperation**: Shared resources, collective efforts

## Responsive Design

### Breakpoints

- **Desktop**: 1200px+ (full exhibition layout)
- **Tablet**: 768px-1199px (adjusted grid layouts)
- **Mobile**: <768px (stacked layout, optimized 3D containers)

### Accessibility Features

- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes
- Focus indicators for interactive elements

## Browser Compatibility

### Supported Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### WebGL Requirements

- Hardware acceleration enabled
- Modern graphics drivers
- Sufficient memory for 3D rendering

## Performance Optimization

### 3D Rendering

- Efficient geometry usage
- Optimized lighting and materials
- Responsive camera controls
- Suspense boundaries for model loading

### Content Loading

- Lazy loading for non-critical content
- Optimized image assets
- Efficient state management
- Smooth animations with Framer Motion

## Future Enhancements

### Planned Features

- **Audio Integration**: Traditional Aeta music and language samples
- **Virtual Reality**: Immersive VR museum experience
- **Community Stories**: Personal narratives from Aeta community members
- **Interactive Workshops**: Virtual cultural learning activities
- **Multilingual Support**: Additional Philippine language options

### Technical Improvements

- **Advanced 3D Models**: Higher detail and texture mapping
- **Performance Monitoring**: Analytics and user experience tracking
- **Offline Support**: Progressive Web App capabilities
- **API Integration**: Dynamic content updates and community contributions

## Contributing

### Cultural Content

- All cultural information must be verified with Aeta community members
- Respectful representation and accurate cultural context required
- Community consultation for any new content additions

### Technical Contributions

- Follow React best practices and component patterns
- Maintain accessibility standards
- Ensure responsive design across all devices
- Test 3D functionality across different browsers

## License & Attribution

### Cultural Rights

- Aeta cultural heritage belongs to the Aeta people
- Exhibition created with community permission and consultation
- Cultural content may not be used without proper attribution

### Technical License

- MIT License for code components
- Attribution required for cultural content
- Community consultation required for cultural modifications

## Contact & Support

### Cultural Inquiries

- Contact local Aeta community organizations
- Consult with cultural experts and indigenous rights advocates
- Respect community protocols and consultation processes

### Technical Support

- GitHub issues for bug reports
- Documentation updates and improvements
- Performance optimization suggestions

## Acknowledgments

- Aeta community members and cultural experts
- Indigenous rights advocates and organizations
- Cultural preservation specialists
- Technical contributors and developers
- Community partners and supporters

---

**Note**: This exhibition is designed to promote cultural awareness and respect for Aeta heritage. All content should be used in accordance with cultural sensitivity guidelines and community consultation requirements.

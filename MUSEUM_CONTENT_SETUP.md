# Museum Content Management System Setup

This document provides instructions for setting up and using the Museum Content Management System for the Aeta Museum Exhibition.

## Overview

The Museum Content Management System allows administrators to:

- Manage traditional artifacts with 3D models and descriptions
- Update cultural heritage information (languages, festivals, rituals)
- Manage living culture gallery (videos and multimedia content)
- Upload and manage images for artifacts and videos

## Database Setup

### 1. Run the SQL Script

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `museum_database_setup.sql`
4. Run the script to create all necessary tables and sample data

### 2. Create Storage Bucket

1. In your Supabase dashboard, go to Storage
2. Create a new bucket named `museum-images`
3. Set the bucket to public
4. Enable Row Level Security (RLS)

## Features

### Traditional Artifacts Management

- **Add New Artifacts**: Create new artifacts with title, description, English/Aeta text, and images
- **Edit Artifacts**: Modify existing artifact information
- **Delete Artifacts**: Remove artifacts from the system
- **Categories**: Organize artifacts by type (hunting tools, clothing, jewelry, etc.)
- **Image Upload**: Upload images directly or provide image URLs

### Cultural Heritage Management

- **Languages & Dialects**: Manage Aeta language information
- **Festivals & Celebrations**: Update festival details and descriptions
- **Life Cycle Rituals**: Manage ritual information and age requirements

### Living Culture Gallery

- **Video Management**: Add cultural videos with thumbnails and descriptions
- **Thumbnail Upload**: Upload custom thumbnails for videos
- **Video URLs**: Link to external video platforms

## Admin Access

### Navigation

1. Log in to the admin panel at `/admin`
2. Navigate to the "🏛️ Museum Content" section in the sidebar
3. Use the tabbed interface to manage different content types

### Permissions

- **Read Access**: Public (all visitors can view content)
- **Write Access**: Authenticated users only (admin functionality)
- **Image Storage**: Uses Supabase storage with public access

## Content Structure

### Artifacts

```json
{
  "title": "Artifact Name",
  "description": "Brief description",
  "englishText": "Detailed English description",
  "aetaText": "Detailed Aeta language description",
  "imageUrl": "Image URL or uploaded file",
  "category": "hunting|clothing|jewelry|ceremonial|domestic"
}
```

### Languages

```json
{
  "name": "Language Name",
  "region": "Geographic region",
  "speakers": "Number of speakers"
}
```

### Festivals

```json
{
  "name": "Festival Name",
  "description": "Festival description",
  "month": "Month of celebration"
}
```

### Rituals

```json
{
  "name": "Ritual Name",
  "description": "Ritual description",
  "age": "Age requirement"
}
```

### Videos

```json
{
  "title": "Video Title",
  "description": "Video description",
  "thumbnail": "Thumbnail image",
  "duration": "Video duration",
  "videoUrl": "Video platform URL"
}
```

## Frontend Integration

The museum exhibition page (`AetaMuseumExhibition.js`) automatically:

- Fetches content from the database
- Displays artifacts with 3D models and real images
- Shows cultural heritage information in organized tabs
- Displays living culture videos with thumbnails
- Falls back to default content if database is unavailable

## File Structure

```
src/
├── pages/
│   ├── admin/
│   │   ├── MuseumContentManagement.js    # Main admin interface
│   │   └── AdminLayout.js                # Updated with museum content link
│   └── AetaMuseumExhibition.js           # Updated to use database
├── App.js                                # Updated with new route
└── museum_database_setup.sql             # Database setup script
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**

   - Verify Supabase credentials in `src/supabase.js`
   - Check if tables exist in the database
   - Ensure RLS policies are properly configured

2. **Image Upload Failures**

   - Verify storage bucket exists and is public
   - Check file size limits
   - Ensure proper file permissions

3. **Content Not Loading**
   - Check browser console for errors
   - Verify database policies allow read access
   - Check if sample data was inserted correctly

### Performance Tips

- Use appropriate image sizes for thumbnails
- Optimize 3D models for web viewing
- Consider implementing pagination for large content lists
- Use CDN for frequently accessed images

## Security Considerations

- All content is publicly readable
- Only authenticated users can modify content
- Image uploads are restricted to image file types
- RLS policies ensure proper access control
- No sensitive information should be stored in this system

## Future Enhancements

- Content versioning and history
- Bulk import/export functionality
- Advanced search and filtering
- Content approval workflows
- Multi-language support expansion
- Analytics and usage tracking

## Support

For technical support or questions about the Museum Content Management System:

- Check the browser console for error messages
- Verify database setup and permissions
- Review the sample data structure
- Ensure all required dependencies are installed

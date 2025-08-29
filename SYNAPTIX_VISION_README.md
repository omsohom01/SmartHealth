# Synaptix Vision - Enhanced Medical Image Analysis

A complete React (Next.js 14) application for AI-powered medical image analysis using Hugging Face models with Gemini AI-generated explanations and suggestions.

## Features

- **Multi-Model Support**: Supports X-ray, CT scan, skin cancer, and wound classification
- **Drag & Drop Upload**: Intuitive file upload with validation
- **Hybrid AI Analysis**: Combines Hugging Face inference with Gemini AI explanations
- **Real-time Progress**: Realistic progress bars with stage indicators
- **AI Explanations**: User-friendly explanations of medical findings
- **Smart Suggestions**: Actionable recommendations based on analysis results
- **Comprehensive Error Handling**: Graceful fallbacks and clear error messages
- **Dark Theme**: Modern, animated dark UI with Tailwind CSS
- **Auto-detection**: Automatically selects the best model based on filename

## Enhanced Workflow

1. **Image Upload**: User uploads medical image with validation
2. **Hugging Face Analysis**: Image sent to specialized medical AI model
3. **Gemini AI Processing**: Analysis results processed by Gemini for explanations
4. **Hybrid Response**: Combined technical results with user-friendly explanations
5. **Smart Recommendations**: AI-generated suggestions based on findings
6. **Medical Disclaimers**: Appropriate medical disclaimers and limitations

## API Response Format

```json
{
  "success": true,
  "results": [
    {
      "label": "Normal",
      "score": 0.82
    }
  ],
  "modelUsed": "Chest X-Ray Analysis",
  "explanation": "The AI analysis shows normal chest X-ray findings with 82% confidence...",
  "suggestions": "Continue regular health checkups and maintain good respiratory hygiene...",
  "disclaimer": "This AI analysis is for informational purposes only...",
  "source": "huggingface + gemini hybrid diagnosis"
}
```

## Environment Variables

Create a `.env.local` file:
```bash
HUGGINGFACE_API_KEY=your_huggingface_token_here
GEMINI_API_KEY=your_gemini_api_key_here
```

## Enhanced Features

### AI-Powered Explanations
- **Clear Interpretations**: User-friendly explanations of medical findings
- **Confidence Levels**: Visual indicators for result confidence
- **Context-Aware**: Explanations tailored to specific medical domains

### Smart Recommendations
- **Actionable Advice**: Practical next steps based on findings
- **Risk Assessment**: Guidance on when to seek medical attention
- **Preventive Care**: Recommendations for ongoing health maintenance

### Robust Error Handling
- **API Fallbacks**: Graceful handling of API failures
- **Mock Data**: Demonstration mode when APIs are unavailable
- **Clear Messages**: User-friendly error explanations

### Enhanced UI Components
- **Progress Stages**: Multi-stage analysis progress with descriptions
- **Result Categories**: Color-coded confidence indicators
- **Expandable Sections**: AI explanations and suggestions in dedicated sections
- **Upload Validation**: Real-time file validation with clear error messages

## Technical Implementation

### Backend Workflow
1. **Image Validation**: File type, size, and format validation
2. **Model Selection**: Automatic or manual model selection
3. **Hugging Face API**: Direct integration with medical AI models
4. **Gemini Processing**: AI-generated explanations and suggestions
5. **Response Formatting**: Structured JSON response with all data
6. **Error Handling**: Comprehensive error handling with fallbacks

### Frontend Features
- **Real-time Validation**: Instant feedback on file uploads
- **Progressive Enhancement**: Graceful degradation for API failures
- **Responsive Design**: Mobile-friendly interface
- **Accessibility**: Screen reader compatible
- **Performance**: Optimized loading and rendering

## Security & Privacy

- **Server-side Processing**: All API keys handled server-side
- **File Validation**: Comprehensive file type and size validation
- **No Storage**: Images processed in memory, not stored
- **Rate Limiting**: Built-in rate limiting protection
- **Error Sanitization**: Sensitive error details filtered

## Usage Example

```typescript
// Upload and analyze an image
const formData = new FormData()
formData.append('image', imageFile)
formData.append('model', 'xray')

const response = await fetch('/api/analyze-image', {
  method: 'POST',
  body: formData
})

const result = await response.json()
console.log(result.explanation) // AI explanation
console.log(result.suggestions) // AI suggestions
```

## Medical Disclaimer

This application is designed for educational and informational purposes only. All AI analysis results should be interpreted by qualified healthcare professionals. The system includes appropriate medical disclaimers and limitations in all responses.

## License

MIT License - see LICENSE file for details

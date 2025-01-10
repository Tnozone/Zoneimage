import { render, screen } from '@testing-library/react';
import App from './App';
import imglyRemoveBackground from '@imgly/background-removal';

// Mock the imglyRemoveBackground function
jest.mock('@imgly/background-removal', () => jest.fn());

describe('App Component', () => {
  it('renders the ImageUpload component', () => {
    render(<App />);
    const inputElement = screen.getByRole('textbox', { hidden: true }); // Assuming input is hidden in UI but accessible to tests.
    expect(inputElement).toBeInTheDocument();
  });

  it('handles image upload and sets the image', async () => {
    const mockBlob = new Blob(['mockImage'], { type: 'image/png' });
    const mockFile = new File(['dummy content'], 'example.png', { type: 'image/png' });

    imglyRemoveBackground.mockResolvedValue(mockBlob);
    URL.createObjectURL = jest.fn(() => 'mockImageURL');

    render(<App />);

    const inputElement = screen.getByLabelText(/upload/i); // Matches the input's accessible name.
    fireEvent.change(inputElement, { target: { files: [mockFile] } });

    // Expect imglyRemoveBackground to have been called
    expect(imglyRemoveBackground).toHaveBeenCalledWith(mockFile);

    // Wait for the image to be rendered
    const imgElement = await screen.findByAltText(/Processed/i);
    expect(imgElement).toHaveAttribute('src', 'mockImageURL');
  });
});
import { render, fireEvent, screen } from '@testing-library/react';
import ImageUpload from './ImageUpload';

describe('ImageUpload Component', () => {
  it('renders an input field for file upload', () => {
    const mockOnImageUpload = jest.fn();
    render(<ImageUpload onImageUpload={mockOnImageUpload} />);

    const inputElement = screen.getByLabelText(/upload/i);
    expect(inputElement).toBeInTheDocument();
  });

  it('calls onImageUpload when a file is selected', () => {
    const mockOnImageUpload = jest.fn();
    render(<ImageUpload onImageUpload={mockOnImageUpload} />);

    const mockFile = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const inputElement = screen.getByLabelText(/upload/i);

    fireEvent.change(inputElement, { target: { files: [mockFile] } });
    expect(mockOnImageUpload).toHaveBeenCalledWith(expect.any(Object));
  });
});
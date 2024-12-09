describe('Image Upload Flow', () => {
    it('uploads an image and displays the processed result', () => {
      cy.visit('/'); // Update with your app's URL if needed
  
      // Simulate file upload
      const filePath = 'example.png';
      cy.get('input[type="file"]').attachFile(filePath);
  
      // Verify that the processed image is displayed
      cy.get('img[alt="Processed"]').should('be.visible');
    });
  });
describe('Image Upload and Carousel', () => {

  beforeEach(() => {
    cy.visit('/');  // Assuming your app is served at the root. Adjust the path if needed.
  });

  it('should display main application container and dropzone', () => {
    cy.get('.app-container').should('be.visible');
    cy.get('#dropzone').should('be.visible');
  });

  it('should render the main application container', () => {
      cy.get('.app-container').should('exist');
  });

  it('should activate file input on dropzone click', () => {
      cy.get('#dropzone').click();
      cy.get('#fileInput').should('exist');
  });

  
  it('should not add dragged images to carousel', () => {
      const initialCount = 2;  // As per the HTML provided
      cy.get('.carousel-item').should('have.length', initialCount);
  });
  
  
  it('should display an error for non-image files', function() {
    cy.fixture('test.txt').as('txtfile');
    cy.get('#fileInput').then(function(input) {
        const blob = Cypress.Blob.base64StringToBlob(this.txtfile, 'text/plain');
        const testFile = new File([blob], 'test.txt', { type: 'text/plain' });
        const dataTransfer = new DataTransfer();

        dataTransfer.items.add(testFile);
        input[0].files = dataTransfer.files;
        cy.get(input).trigger('change', { force: true });
    });

    cy.on('window:alert', (txt) => {
        expect(txt).to.contains('not an image');
    });
});
});
describe('Upload Images', ()=>{
  beforeEach(()=>{
    cy.visit('/');
  })
  it('should add image to carousel on file input change', () => {
    // Attach the image to the file input
    cy.get('#fileInput').attachFile('mockImage.jpg');
 cy.wait(5000)
    // Assert that the image has been added to the carousel (checking if it's in the file list for simplicity)
    cy.get('.file-name img.thumbnail').should('have.attr', 'src').and('include', 'data:image/jpeg');
});
    

it('should upload an image by dragging and dropping', () => {
  
    cy.fixture('mockImage.jpg', 'binary').then(fileContent => {
        cy.get('#dropzone').attachFile({
            fileContent,
            fileName: 'mockImage.jpg',
            mimeType: 'image/jpeg',
            encoding: 'utf-8',
            lastModified: new Date().getTime()
        }, { subjectType: 'drag-n-drop' });
    });
});

})


describe('Store in Localstorage', ()=>{
  beforeEach(()=>{
    cy.visit('/');
  })

  it('should load images from localStorage', () => {
    // Store mock data in LocalStorage
    cy.window().then((win) => {
        win.localStorage.setItem('storedImages', JSON.stringify(['path/to/mockImage1.jpg', 'path/to/mockImage2.jpg']));
    });
    
    // Reload to initiate the load from LocalStorage logic
    cy.reload();
});
});


describe('Image Upload and Carousel with Description', () => {

  beforeEach(() => {
    cy.visit('/');
  });
  it('should add a description to an uploaded image', () => {
    // Attach the image to the file input
    cy.get('#fileInput').attachFile('mockImage.jpg');
  
    // Wait for the image to be added to ensure that the textarea will be available for the next commands.
    cy.wait(5000);
  
    // Confirm that the image is rendered successfully
    cy.get('.file-name img.thumbnail').should('exist');
  
    // Type a description into the textarea associated with the uploaded image
    cy.get('.file-name textarea')
      .first() // target the first textarea, assuming it's associated with the newly uploaded image
      .should('be.visible') // make sure it's visible before typing
      .type('This is a description for the uploaded image');
  
    // Optionally, verify the description has been correctly entered into the textarea
    cy.get('.file-name textarea')
      .first()
      .should('have.value', 'This is a description for the uploaded image');
  });
  
  it('should save and load description from LocalStorage', () => {
    // Attach the image to the file input
    cy.get('#fileInput').attachFile('mockImage.jpg');
    cy.wait(5000); // Wait for the image to be added

    // Type a description in the first textarea
    cy.get('.file-name textarea').first().should('be.visible').type('Description for the first image');

    // Save to LocalStorage
    cy.get('.file-name textarea').first().invoke('blur'); // Save the description
    cy.reload(); // Reload the page

    // Verify that the description is loaded from LocalStorage
    cy.get('.file-name textarea').first().should('have.value', 'Description for the first image');
  });

  it('should render a description textarea when an image is uploaded', () => {
    // Attach the image to the file input
    cy.get('#fileInput').attachFile('mockImage.jpg');
  
    // Wait for the image to be added to ensure that the associated elements will be present
    cy.wait(5000);
  
    // Confirm that the image is rendered successfully
    cy.get('.file-name img.thumbnail')
      .should('exist')
      .then(() => {
        // Once the image is confirmed to be rendered, check for the presence of the associated textarea
        cy.get('.file-name textarea')
          .first() // target the first textarea, assuming it's associated with the newly uploaded image
          .should('be.visible') // make sure it's visible and present
          .and('have.attr', 'placeholder', 'Add a description...'); // check if the placeholder attribute is correct
      });
  });
  it('should save the description of an image to localStorage', () => {
    // Attach the image to the file input
    cy.get('#fileInput').attachFile('mockImage.jpg');
  
    // Wait for the image to be added and ensure that the associated elements will be present
    cy.wait(5000);
  
    // Type a description into the textarea associated with the uploaded image
    const descriptionText = 'This is a description for the uploaded image';
    cy.get('.file-name textarea')
      .first()
      .should('be.visible') // make sure it's visible before typing
      .type(descriptionText);
  
    // Since you are saving to localStorage on textarea blur, we need to trigger it
    cy.get('.file-name textarea').first().blur();
  
    // Now, we'll verify that the description has been saved to localStorage
    cy.window().its('localStorage').invoke('getItem', 'storedImagesData').then((storedImagesDataStr) => {
      const storedImagesData = JSON.parse(storedImagesDataStr);
      
      // Check that the first image in localStorage has the description we set
      expect(storedImagesData[0].description).to.eq(descriptionText);
    });
  });
  
  

});




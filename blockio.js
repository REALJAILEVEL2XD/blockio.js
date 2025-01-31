(function(global) {
  const Blockio = {
    blocks: [],
    workspace: null,
    
    // Create a block with a given name, color, and type
    createBlock: function(name, color, type) {
      const block = document.createElement('div');
      block.classList.add('blockio-block', type);
      block.innerHTML = name;
      block.style.backgroundColor = color;
      block.setAttribute('draggable', 'true');
      block.setAttribute('data-type', type);

      // Handle drag events
      block.addEventListener('dragstart', this.onDragStart);
      block.addEventListener('dragover', this.onDragOver);
      block.addEventListener('drop', this.onDrop);
      block.addEventListener('dragenter', this.onDragEnter);
      block.addEventListener('dragleave', this.onDragLeave);

      this.blocks.push(block);
      return block;
    },

    // Handle the dragstart event
    onDragStart: function(event) {
      event.dataTransfer.setData('text', event.target.innerHTML);
      event.dataTransfer.setData('block-type', event.target.getAttribute('data-type'));
    },

    // Handle the dragover event
    onDragOver: function(event) {
      event.preventDefault();
    },

    // Handle the drop event
    onDrop: function(event) {
      event.preventDefault();
      const data = event.dataTransfer.getData('text');
      const type = event.dataTransfer.getData('block-type');
      const droppedBlock = Blockio.createBlock(data, 'gray', type);
      
      // Snap the block into the workspace
      Blockio.workspace.appendChild(droppedBlock);
    },

    // Handle dragenter (highlight snap area)
    onDragEnter: function(event) {
      event.target.style.border = '2px solid #00FF00'; // Highlight drop area
    },

    // Handle dragleave (remove highlight)
    onDragLeave: function(event) {
      event.target.style.border = ''; // Remove highlight
    },

    // Initialize the workspace
    setWorkspace: function(container) {
      this.workspace = container;
    },

    // Add blocks to a container (for the palette)
    addToContainer: function(container) {
      this.blocks.forEach(block => {
        container.appendChild(block);
      });
    },

    // Save the program state
    saveProgram: function() {
      const blocksState = [];
      const blocks = this.workspace.querySelectorAll('.blockio-block');
      blocks.forEach(block => {
        blocksState.push({
          name: block.innerHTML,
          color: block.style.backgroundColor,
          type: block.getAttribute('data-type')
        });
      });
      localStorage.setItem('blockioProgram', JSON.stringify(blocksState));
    },

    // Load a saved program
    loadProgram: function() {
      const savedProgram = JSON.parse(localStorage.getItem('blockioProgram'));
      if (savedProgram) {
        savedProgram.forEach(blockData => {
          const block = this.createBlock(blockData.name, blockData.color, blockData.type);
          this.workspace.appendChild(block);
        });
      }
    }
  };

  // Expose Blockio to the global window object
  global.Blockio = Blockio;
})(this);

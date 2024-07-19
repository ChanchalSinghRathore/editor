document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.getElementById('image-container');
    const addTextBtn = document.getElementById('add-text-btn');
    const fontSelect = document.getElementById('font-select');
    const fontSizeInput = document.getElementById('font-size');
    const fontColorInput = document.getElementById('font-color');
    const boldBtn = document.getElementById('bold-btn');
    const italicBtn = document.getElementById('italic-btn');
    const underlineBtn = document.getElementById('underline-btn');
    const imageUpload = document.getElementById('image-upload');
    const mainImage = document.getElementById('main-image');
    const deleteBtn = document.getElementById('delete-btn');
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');

    let bold = false;
    let italic = false;
    let underline = false;
    let selectedTextElement = null;

    const undoStack = [];
    const redoStack = [];

    function saveState() {
        const state = imageContainer.innerHTML;
        undoStack.push(state);
        redoStack.length = 0;
        updateUndoRedoButtons();
    }

    function updateUndoRedoButtons() {
        undoBtn.disabled = undoStack.length === 0;
        redoBtn.disabled = redoStack.length === 0;
    }

    undoBtn.addEventListener('click', () => {
        if (undoStack.length > 0) {
            redoStack.push(imageContainer.innerHTML);
            const lastState = undoStack.pop();
            imageContainer.innerHTML = lastState;
            updateUndoRedoButtons();
            attachTextElementEvents();
        }
    });

    redoBtn.addEventListener('click', () => {
        if (redoStack.length > 0) {
            undoStack.push(imageContainer.innerHTML);
            const nextState = redoStack.pop();
            imageContainer.innerHTML = nextState;
            updateUndoRedoButtons();
            attachTextElementEvents();
        }
    });

    function attachTextElementEvents() {
        const textElements = document.querySelectorAll('.draggable-text');
        textElements.forEach(textElement => {
            textElement.addEventListener('dragstart', dragStart);
            textElement.addEventListener('dragend', dragEnd);
            textElement.addEventListener('click', selectTextElement);
        });
    }

    boldBtn.addEventListener('click', () => {
        bold = !bold;
        boldBtn.classList.toggle('active');
        updateTextStyle();
    });

    italicBtn.addEventListener('click', () => {
        italic = !italic;
        italicBtn.classList.toggle('active');
        updateTextStyle();
    });

    underlineBtn.addEventListener('click', () => {
        underline = !underline;
        underlineBtn.classList.toggle('active');
        updateTextStyle();
    });

    fontSelect.addEventListener('change', updateTextStyle);
    fontSizeInput.addEventListener('input', updateTextStyle);
    fontColorInput.addEventListener('input', updateTextStyle);

    addTextBtn.addEventListener('click', () => {
        const textElement = document.createElement('div');
        textElement.contentEditable = true;
        textElement.classList.add('draggable-text');
        textElement.style.position = 'absolute';
        textElement.style.fontFamily = fontSelect.value;
        textElement.style.fontSize = `${fontSizeInput.value}px`;
        textElement.style.color = fontColorInput.value;
        textElement.style.cursor = 'move';
        textElement.style.userSelect = 'none';
        textElement.style.border = '1px dashed #ccc';
        textElement.style.padding = '5px';
        textElement.style.minWidth = '50px';

        if (bold) textElement.style.fontWeight = 'bold';
        if (italic) textElement.style.fontStyle = 'italic';
        if (underline) textElement.style.textDecoration = 'underline';

        textElement.draggable = true;
        textElement.addEventListener('dragstart', dragStart);
        textElement.addEventListener('dragend', dragEnd);
        textElement.addEventListener('click', selectTextElement);

        imageContainer.appendChild(textElement);
        saveState();
    });

    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                mainImage.src = e.target.result;
                saveState();
            };
            reader.readAsDataURL(file);
        }
    });

    function dragStart(e) {
        e.dataTransfer.setData('text/plain', null);
        e.dataTransfer.setDragImage(new Image(), 0, 0);
        this.style.opacity = '0.5';
    }

    function dragEnd(e) {
        this.style.left = `${e.pageX - imageContainer.offsetLeft}px`;
        this.style.top = `${e.pageY - imageContainer.offsetTop}px`;
        this.style.opacity = '1';
        saveState();
    }

    function selectTextElement(e) {
        if (selectedTextElement) {
            selectedTextElement.style.border = '1px dashed #ccc';
        }
        selectedTextElement = e.target;
        selectedTextElement.style.border = '2px solid #007bff';
        deleteBtn.style.display = 'block';
    }

    function updateTextStyle() {
        if (selectedTextElement) {
            selectedTextElement.style.fontFamily = fontSelect.value;
            selectedTextElement.style.fontSize = `${fontSizeInput.value}px`;
            selectedTextElement.style.color = fontColorInput.value;
            selectedTextElement.style.fontWeight = bold ? 'bold' : 'normal';
            selectedTextElement.style.fontStyle = italic ? 'italic' : 'normal';
            selectedTextElement.style.textDecoration = underline ? 'underline' : 'none';
            saveState();
        }
    }

    deleteBtn.addEventListener('click', () => {
        if (selectedTextElement) {
            selectedTextElement.remove();
            selectedTextElement = null;
            deleteBtn.style.display = 'none';
            saveState();
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target === imageContainer || e.target === mainImage) {
            if (selectedTextElement) {
                selectedTextElement.style.border = '1px dashed #ccc';
                selectedTextElement = null;
                deleteBtn.style.display = 'none';
            }
        }
    });
});

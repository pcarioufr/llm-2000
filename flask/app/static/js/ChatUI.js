import { clearIcon, editIcon, sendIcon, saveIcon, cancelIcon, userIcon, recycleIcon, questionIcon, restartIcon } from './icons.js';

class ChatUI {
    constructor() {
        this.thread = document.querySelector('.chat-thread');
        this.messagesContainer = document.getElementById('chat-messages');
        this.input = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-button');
        this.clearButton = document.getElementById('clear-chat-button');
        this.editPromptButton = document.getElementById('edit-prompt-button');
        this.savePromptButton = document.getElementById('save-prompt');
        this.cancelPromptButton = document.getElementById('cancel-prompt');
        this.editUserButton = document.getElementById('edit-user-button');
        this.cancelUserButton = document.getElementById('cancel-user');
        this.reloadPromptButton = document.getElementById('reload-prompt');
        this.helpButton = document.getElementById('help-button');
        this.closeHelpButton = document.getElementById('close-help');
        this.restartButton = document.getElementById('restart-error');

        // Set button icons
        this.sendButton.innerHTML = sendIcon;
        this.clearButton.innerHTML = clearIcon;
        this.editPromptButton.innerHTML = editIcon;
        this.savePromptButton.innerHTML = saveIcon;
        this.cancelPromptButton.innerHTML = cancelIcon;
        this.editUserButton.innerHTML = userIcon;
        this.cancelUserButton.innerHTML = cancelIcon;
        this.reloadPromptButton.innerHTML = recycleIcon;
        this.helpButton.innerHTML = questionIcon;
        this.closeHelpButton.innerHTML = cancelIcon;
        this.restartButton.innerHTML = restartIcon;

        // Setup help modal events
        this.helpModal = document.getElementById('help-modal');
        this.helpButton.addEventListener('click', () => this.showHelpModal());
        this.closeHelpButton.addEventListener('click', () => this.hideHelpModal());

        // Setup error modal events
        this.errorModal = document.getElementById('error-modal');
        this.restartButton.addEventListener('click', () => window.location.reload());

        // Setup input auto-resize
        this.input.addEventListener('input', () => this.autoResizeInput());
    }

    autoResizeInput() {
        this.input.style.height = 'auto';
        const newHeight = Math.min(this.input.scrollHeight, 120);
        this.input.style.height = newHeight + 'px';
    }

    smoothScrollToBottom() {
        const startTime = Date.now();
        const startScroll = this.thread.scrollTop;
        const targetScroll = this.thread.scrollHeight - this.thread.offsetHeight;
        
        console.log('[Scroll] Starting scroll animation');
        console.log(`[Scroll] Start position: ${startScroll}px`);
        console.log(`[Scroll] Target position: ${targetScroll}px`);
        
        this.thread.style.scrollBehavior = 'smooth';
        this.thread.scrollTop = targetScroll;
        
        setTimeout(() => {
            this.thread.style.scrollBehavior = 'auto';
            console.log(`[Scroll] Final position: ${this.thread.scrollTop}px`);
            console.log(`[Scroll] Animation completed after ${Date.now() - startTime}ms`);
        }, 300);
    }

    addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'assistant-message'}`;
        messageDiv.style.whiteSpace = 'pre-wrap';
        messageDiv.innerText = content;
        this.messagesContainer.appendChild(messageDiv);
        this.smoothScrollToBottom();
        return messageDiv;
    }

    showLoading() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message assistant-message';
        messageDiv.style.whiteSpace = 'pre-wrap';
        
        const loadingDots = document.createElement('div');
        loadingDots.className = 'loading-dots';
        loadingDots.innerHTML = '<span></span><span></span><span></span>';
        
        messageDiv.appendChild(loadingDots);
        this.messagesContainer.appendChild(messageDiv);
        this.smoothScrollToBottom();
        return { messageDiv, loadingDots };
    }

    clearMessages() {
        this.messagesContainer.innerHTML = '';
    }

    setInputState(enabled) {
        this.sendButton.disabled = !enabled;
        if (enabled) {
            this.input.focus();
        }
    }

    showHelpModal() {
        this.helpModal.classList.add('show');
    }

    hideHelpModal() {
        this.helpModal.classList.remove('show');
    }

    showErrorModal(message) {
        const errorMessageElement = document.getElementById('error-message');
        
        // Simple markdown parsing for error messages only
        const markdownToHtml = (text) => {
            return text
                // Convert [text](url) to <a href="url" target="_blank" rel="noopener">text</a>
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
                // Convert `code` to <code>code</code>
                .replace(/`([^`]+)`/g, '<code>$1</code>')
                // Convert **bold** to <strong>bold</strong>
                .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                // Convert *italic* to <em>italic</em>
                .replace(/\*([^*]+)\*/g, '<em>$1</em>')
                // Convert double line breaks to paragraph breaks
                .replace(/\n\n/g, '</p><p>')
                // Wrap in paragraph tags
                .replace(/^(.*)$/s, '<p>$1</p>');
        };
        
        // Set HTML content with markdown parsing
        errorMessageElement.innerHTML = markdownToHtml(message);
        this.errorModal.classList.add('show');
    }

    hideErrorModal() {
        this.errorModal.classList.remove('show');
    }
}

export default ChatUI; 
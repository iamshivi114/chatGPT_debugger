import { ICommandPalette, WidgetTracker } from '@jupyterlab/apputils';
import { PanelLayout, Widget } from '@lumino/widgets';
import '../style/index.css';
class MyWidget extends Widget {
    constructor() {
        super();
        this.addClass('my-extension');
        // Create the input element
        this.input = document.createElement('input');
        this.input.placeholder = 'Type here...';
        // Wrap the input element in a widget
        const inputWidget = new Widget({ node: this.input });
        // Create the button element
        this.button = document.createElement('button');
        this.button.textContent = 'Enter';
        // Wrap the button element in a widget
        const buttonWidget = new Widget({ node: this.button });
        // Create the hint element
        this.hint = document.createElement('div');
        this.hint.textContent = 'Hint: ';
        // Wrap the hint element in a widget
        const hintWidget = new Widget({ node: this.hint });
        // Set up the widget layout
        const layout = new PanelLayout();
        layout.addWidget(inputWidget);
        layout.addWidget(buttonWidget);
        layout.addWidget(hintWidget);
        this.layout = layout;
        // Attach the click event handler to the button
        this.button.addEventListener('click', async () => {
            // Get the text from the input box
            const text = this.input.value;
            // Make a POST request to the Flask server
            const response = await this.getResponse(text);
            // Get the hint from the response
            const hint = JSON.parse(response).hint;
            // Update the hint element with the response
            this.hint.textContent = `Hint: ${hint}`;
            // Clear the input box
            this.input.value = '';
        });
    }
    async getResponse(query) {
        const response = await fetch('http://localhost:5000/get_response', {
            method: 'POST',
            body: JSON.stringify({ query }),
            // mode: 'no-cors', // add this line to disable CORS
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const json = await response.json();
        return json.response;
    }
}
/**
 * Initialization data for the my-extension extension.
 */
const extension = {
    id: 'my-extension',
    autoStart: true,
    requires: [ICommandPalette],
    activate: (app, palette) => {
        console.log('JupyterLab extension chatgpt debugger is activated - Check!');
        // Create a new widget
        const widget = new MyWidget();
        widget.id = 'my-extension-widget';
        widget.title.label = 'ChatGPT Tutor';
        widget.title.closable = true;
        // Add the widget to the main area
        app.shell.add(widget, 'right');
        // Track and restore the widget state
        const tracker = new WidgetTracker({ namespace: 'my-extension' });
        tracker.add(widget);
        // Add the command to the palette.
        const command = 'my-extension:open';
        app.commands.addCommand(command, {
            label: 'Open ChatGPT Tutor',
            execute: () => {
                if (!widget.isAttached) {
                    // Attach the widget to the main area if it's not there
                    app.shell.add(widget, 'right');
                }
                // Activate the widget
                app.shell.activateById(widget.id);
            }
        });
        palette.addItem({ command, category: 'My Extensions' });
    }
};
export default extension;
//# sourceMappingURL=index.js.map
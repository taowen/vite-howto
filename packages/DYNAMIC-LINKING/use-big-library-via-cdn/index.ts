import monaco from 'monaco-editor';

export function renderApp() {
	monaco.editor.create(document.body, {
		value: "function hello() {\n\talert('Hello world!');\n}",
		language: 'javascript'
	});
}

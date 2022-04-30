import monaco from 'monaco-editor';

monaco.editor.create(document.body, {
	value: "function hello() {\n\talert('Hello world!');\n}",
	language: 'javascript'
});

import { Component } from "react";
import MDEditor from "@uiw/react-md-editor";
import katex from "katex";
import { getCodeString } from 'rehype-rewrite';

const CustomCode = ({ inline, children = [], className, ...props }) => {
    const txt = children[0] || '';
    if (inline) {
        if (typeof txt === 'string' && /^\$\$(.*)\$\$/.test(txt)) {
        const html = katex.renderToString(txt.replace(/^\$\$(.*)\$\$/, '$1'), {
            throwOnError: false,
        });
        return <code dangerouslySetInnerHTML={{ __html: html }} />;
        }
        return <code>{txt}</code>;
    }
    const code = props.node && props.node.children ? getCodeString(props.node.children) : txt;
    if (
        typeof code === 'string' &&
        typeof className === 'string' &&
        /^language-katex/.test(className.toLocaleLowerCase())
    ) {
        const html = katex.renderToString(code, {
        throwOnError: false,
        });
        return <code style={{ fontSize: '150%' }} dangerouslySetInnerHTML={{ __html: html }} />;
    }
    return <code className={String(className)}>{txt}</code>;
  };

export default class CustomEditor extends Component{

    render(){
        return(
            <MDEditor data-color-mode="light" onBlur={this.props.onBlur} height={200} value={this.props.value} previewOptions={{
                components: {
                    code: CustomCode,
                },
            }} onChange={this.props.onChange} />
        );
    }
}
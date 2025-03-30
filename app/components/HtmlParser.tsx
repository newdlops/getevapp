import React from 'react';
import { Text, TextStyle } from 'react-native';

interface ParsedNode {
  type: 'text' | 'tag';
  tagName?: string;
  content?: string;
  children?: ParsedNode[];
}

// 간단한 재귀 파서: 제한된 HTML 태그만 처리 (예: b, i, u, p, br)
const parseHTML = (html: string): ParsedNode[] => {
  let index = 0;
  const nodes: ParsedNode[] = [];

  const parseNodes = (): ParsedNode[] => {
    const result: ParsedNode[] = [];
    while (index < html.length) {
      if (html[index] === '<') {
        // 닫는 태그이면 현재 재귀를 종료합니다.
        if (html.substring(index, index + 2) === '</') {
          break;
        } else {
          // 열리는 태그 처리 (속성은 고려하지 않음)
          const endTagIndex = html.indexOf('>', index);
          if (endTagIndex === -1) break; // 잘못된 HTML인 경우 종료
          const tagContent = html.substring(index + 1, endTagIndex).trim();
          // self-closing 태그 처리 (예: <br>)
          if (tagContent.toLowerCase() === 'br') {
            result.push({ type: 'tag', tagName: 'br', children: [] });
            index = endTagIndex + 1;
            continue;
          }
          // 태그 이름 추출 (예: b, i, p 등)
          const tagName = tagContent.toLowerCase();
          index = endTagIndex + 1;
          // 재귀적으로 자식 노드를 파싱합니다.
          const children = parseNodes();
          // 해당 태그의 닫는 태그 찾기
          const closingTag = `</${tagName}>`;
          if (html.substring(index, index + closingTag.length).toLowerCase() === closingTag) {
            index += closingTag.length;
          }
          result.push({ type: 'tag', tagName, children });
        }
      } else {
        // 일반 텍스트 처리
        let nextTag = html.indexOf('<', index);
        if (nextTag === -1) nextTag = html.length;
        const textContent = html.substring(index, nextTag);
        result.push({ type: 'text', content: textContent });
        index = nextTag;
      }
    }
    return result;
  };

  nodes.push(...parseNodes());
  return nodes;
};

// 파싱된 노드를 React Native의 <Text> 컴포넌트로 변환
const renderNodes = (nodes: ParsedNode[], keyPrefix = ''): React.ReactNode[] => {
  return nodes.map((node, idx) => {
    const key = keyPrefix + idx;
    if (node.type === 'text') {
      return <Text key={key}>{node.content}</Text>;
    } else if (node.type === 'tag') {
      let style: TextStyle = {};
      let children = node.children ? renderNodes(node.children, key + '-') : null;
      switch (node.tagName) {
        case 'b':
          style.fontWeight = 'bold';
          break;
        case 'i':
          style.fontStyle = 'italic';
          break;
        case 'u':
          style.textDecorationLine = 'underline';
          break;
        case 'p':
          // p 태그는 단락 구분을 위해 마진을 추가
          return (
            <Text key={key} style={{ marginVertical: 4 }}>
              {children}
            </Text>
          );
        case 'br':
          return <Text key={key}>{'\n'}</Text>;
        default:
          break;
      }
      return (
        <Text key={key} style={style}>
          {children}
        </Text>
      );
    }
  });
};

interface HTMLParserProps {
  html: string;
}

const HTMLParser: React.FC<HTMLParserProps> = ({ html }) => {
  const nodes = parseHTML(html);
  return <Text>{renderNodes(nodes)}</Text>;
};

export default HTMLParser;

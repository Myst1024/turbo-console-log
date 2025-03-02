import { TextDocument } from 'vscode';
import { BracketType } from '../entities';
import { locBrackets } from './locBrackets';
import { closingBracketLine } from './closingBracketLine';

export function getMultiLineContextVariableLine(
  document: TextDocument,
  lineNum: number,
  bracketType: BracketType,
  innerScope = true,
): number | null {
  const { openingBrackets, closingBrackets } = locBrackets(
    document.lineAt(lineNum).text,
    bracketType,
  );
  if (
    innerScope &&
    openingBrackets !== 0 &&
    openingBrackets === closingBrackets
  ) {
    return null;
  }
  let currentLineNum = lineNum - 1;
  let nbrOfOpenedBlockType = 0;
  let nbrOfClosedBlockType = 1; // Closing parenthesis
  while (currentLineNum >= 0) {
    const currentLineText: string = document.lineAt(currentLineNum).text;
    const currentLineParenthesis = locBrackets(currentLineText, bracketType);
    nbrOfOpenedBlockType += currentLineParenthesis.openingBrackets;
    nbrOfClosedBlockType += currentLineParenthesis.closingBrackets;
    if (nbrOfOpenedBlockType === nbrOfClosedBlockType) {
      return closingBracketLine(document, currentLineNum, bracketType) + 1;
    }
    currentLineNum--;
  }
  return null;
}

export enum TokenType {
  Number,
  string,
  Identifier,

  Let,
  Const,
  Function,
  If,
  While,
  Else,

  BinaryOperator,

  GreaterThan,
  LessThan,
  GreaterEqual,
  LessEqual,
  DoubleEqual,
  NotEquals,
  Equals,

  Comma,
  Dot,
  Colon,
  Semicolon,
  OpenParen,
  CloseParen,
  OpenBrace,
  OpenBracket,
  CloseBrace,
  CloseBracket,

  EOF,
}

const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
  const: TokenType.Const,
  function: TokenType.Function,
  if: TokenType.If,
  while: TokenType.While,
  else: TokenType.Else,
};

export interface Token {
  value: string;
  type: TokenType;
}

function token(value = "", type: TokenType): Token {
  return { value, type };
}

function isalpha(src: string) {
  return src.toUpperCase() != src.toLowerCase();
}

function isskippable(str: string) {
  return str == " " || str == "\n" || str == "\t" || str == "\r";
}

function isint(str: string) {
  const c = str.charCodeAt(0);
  const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
  return c >= bounds[0] && c <= bounds[1];
}

export function tokenize(sourceCode: string): Token[] {
  const tokens = new Array<Token>();
  const src = sourceCode.split("");

  while (src.length > 0) {
    // --- Parentheses, braces, brackets ---
    if (src[0] == "(") {
      tokens.push(token(src.shift(), TokenType.OpenParen));
    } else if (src[0] == ")") {
      tokens.push(token(src.shift(), TokenType.CloseParen));
    } else if (src[0] == "{") {
      tokens.push(token(src.shift(), TokenType.OpenBrace));
    } else if (src[0] == "}") {
      tokens.push(token(src.shift(), TokenType.CloseBrace));
    } else if (src[0] == "[") {
      tokens.push(token(src.shift(), TokenType.OpenBracket));
    } else if (src[0] == "]") {
      tokens.push(token(src.shift(), TokenType.CloseBracket));
    }

    // --- Strings ---
    else if (src[0] === '"' || src[0] === "'") {
      const quote = src.shift();
      let str = "";
      let escaped = false;

      while (src.length > 0) {
        const ch = src.shift();
        if (escaped) {
          if (ch === "n") str += "\n";
          else if (ch === "r") str += "\r";
          else if (ch === "t") str += "\t";
          else str += ch;
          escaped = false;
          continue;
        }

        if (ch === "\\") {
          escaped = true;
          continue;
        }

        if (ch === quote) break;
        str += ch;
      }

      tokens.push(token(str, TokenType.string));
    }

    // --- Arithmetic operators ---
    else if (
      src[0] == "+" ||
      src[0] == "-" ||
      src[0] == "*" ||
      src[0] == "/" ||
      src[0] == "%"
    ) {
      tokens.push(token(src.shift(), TokenType.BinaryOperator));
    }

    // --- Comparison and equality operators (multi-char first!) ---
    else if (src[0] == ">" && src[1] == "=") {
      src.shift();
      src.shift();
      tokens.push(token(">=", TokenType.GreaterEqual));
    } else if (src[0] == "<" && src[1] == "=") {
      src.shift();
      src.shift();
      tokens.push(token("<=", TokenType.LessEqual));
    } else if (src[0] == "=" && src[1] == "=") {
      src.shift();
      src.shift();
      tokens.push(token("==", TokenType.DoubleEqual));
    } else if (src[0] == "!" && src[1] == "=") {
      src.shift();
      src.shift();
      tokens.push(token("!=", TokenType.NotEquals));
    } else if (src[0] == ">") {
      tokens.push(token(src.shift(), TokenType.GreaterThan));
    } else if (src[0] == "<") {
      tokens.push(token(src.shift(), TokenType.LessThan));
    } else if (src[0] == "=") {
      tokens.push(token(src.shift(), TokenType.Equals)); // assignment
    }

    // --- Punctuation ---
    else if (src[0] == ";") {
      tokens.push(token(src.shift(), TokenType.Semicolon));
    } else if (src[0] == ":") {
      tokens.push(token(src.shift(), TokenType.Colon));
    } else if (src[0] == ",") {
      tokens.push(token(src.shift(), TokenType.Comma));
    } else if (src[0] == ".") {
      tokens.push(token(src.shift(), TokenType.Dot));
    }

    // --- Numbers ---
    else if (isint(src[0])) {
      let num = "";
      while (src.length > 0 && isint(src[0])) {
        num += src.shift();
      }
      tokens.push(token(num, TokenType.Number));
    }

    // --- Identifiers & keywords ---
    else if (isalpha(src[0])) {
      let ident = "";
      while (src.length > 0 && isalpha(src[0])) {
        ident += src.shift();
      }

      const reserved = KEYWORDS[ident];
      if (typeof reserved == "number") {
        tokens.push(token(ident, reserved));
      } else {
        tokens.push(token(ident, TokenType.Identifier));
      }
    }

    // --- Whitespace ---
    else if (isskippable(src[0])) {
      src.shift();
    }

    // --- Unknown characters ---
    else {
      console.error(
        "Unrecognized character in source:",
        src[0].charCodeAt(0),
        src[0]
      );
      Deno.exit(1);
    }
  }

  tokens.push({ type: TokenType.EOF, value: "EndOfFile" });
  return tokens;
}

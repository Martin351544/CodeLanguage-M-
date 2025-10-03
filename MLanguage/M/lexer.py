from enum import Enum

# Let x = 45 + (foo * bar)

class TokenType(Enum):
    Number = 0
    Identifier = 1
    Equals = 2
    OpenParen = 3
    CloseParen = 4
    BinaryOperator = 5
    Let = 6

KEYWORDS = {
    "let": TokenType.Let,
}

class Token:
    def __init__(self, value: str, type_: TokenType):
        self.value = value
        self.type = type_

    def __repr__(self):
        return f"Token(value='{self.value}', type={self.type.name})"

def token(value="", type_=TokenType.Identifier):
    return Token(value, type_)

def isalpha(char: str):
    return char.isalpha()

def isint(char: str):
    return char.isdigit()

def isskippable(char: str):
    return char in " \n\t"

def tokenize(source_code: str):
    tokens = []
    src = list(source_code)

    while src:
        current = src[0]
        if current == '(':
            tokens.append(token(src.pop(0), TokenType.OpenParen))
        elif current == ')':
            tokens.append(token(src.pop(0), TokenType.CloseParen))
        elif current in "+-*/":
            tokens.append(token(src.pop(0), TokenType.BinaryOperator))
        elif current == "=":
            tokens.append(token(src.pop(0), TokenType.Equals))
        elif isint(current):
            num = ''
            while src and isint(src[0]):
                num += src.pop(0)
            tokens.append(token(num, TokenType.Number))
        elif isalpha(current):
            ident = ''
            while src and isalpha(src[0]):
                ident += src.pop(0)
            reserved = KEYWORDS.get(ident)
            if reserved is None:
                tokens.append(token(ident, TokenType.Identifier))
            else:
                tokens.append(token(ident, reserved))
        elif isskippable(current):
            src.pop(0)
        else:
            print("Unrecognized char found in source:", current)
            exit()

    return tokens

# Example usage
if __name__ == "__main__":
    with open("M/test.txt", "r") as f:
        source = f.read()
    for t in tokenize(source):
        print(t)
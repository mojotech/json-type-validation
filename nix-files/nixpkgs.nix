let source = ''
      {
        "owner": "NixOS",
        "repo": "nixpkgs-channels",
        "rev": "aebdc892d6aa6834a083fb8b56c43578712b0dab",
        "sha256": "1bcpjc7f1ff5k7vf5rwwb7g7m4j238hi4ssnx7xqglr7hj4ms0cz"
      }
      '';
in
import ((import <nixpkgs> {}).fetchFromGitHub (builtins.fromJSON (source)))

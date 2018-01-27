{ nixpkgsFn ? import ./nixpkgs.nix
, system ? null }:
let nixpkgs = nixpkgsFn ({
      # extra config goes here
    } // ( if system == null then {} else { inherit system; } ));
in
nixpkgs.stdenv.mkDerivation {
  name = "json-type-validator";
  buildInputs = with nixpkgs; [ nodejs yarn git ];
  src = "./";

  builder = builtins.toFile "builder.sh" ''
    echo "Use this derivation with nix-shell only"

    exit 1
  '';

  shellHook = ''
    # Get to the source directory
    cd $src
    # Install any new dependencies
    yarn
    # Add node_modules to path
    export PATH=$src/node_modules/bin:$PATH
  '';
}

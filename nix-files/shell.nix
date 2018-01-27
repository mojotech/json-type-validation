{ nixpkgsFn ? import ./nixpkgs.nix
, package ? ./default.nix
}:
(import package { inherit nixpkgsFn; })

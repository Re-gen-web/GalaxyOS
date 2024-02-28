{ pkgs }: {
	deps = [
  pkgs.wget
  pkgs.cron
  pkgs.nodejs-16_x
        pkgs.nodePackages.typescript-language-server
        pkgs.yarn
        pkgs.replitPackages.jest
				pkgs.php74
	];
}
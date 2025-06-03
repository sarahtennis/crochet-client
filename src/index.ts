import { GLService } from "./services/GLService";
import { ShaderService } from "./services/ShaderService";

main();

function main() {
  ShaderService.test();
  GLService.test();
}

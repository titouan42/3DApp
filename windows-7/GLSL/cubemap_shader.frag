#version 330

in vec3 coord_texture;
uniform samplerCube cube_texture;
out vec4 frag_color;

void main () {
  frag_color = texture(cube_texture, coord_texture);
}

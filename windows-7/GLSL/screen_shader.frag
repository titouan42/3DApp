#version 330

in vec2 coord_texture;

uniform sampler2D renderedTexture;

out vec4 frag_color;

void main()
{
	frag_color = texture2D(renderedTexture, coord_texture);
}


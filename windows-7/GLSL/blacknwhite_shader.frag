#version 330

in vec2 coord_texture;

uniform sampler2D renderedTexture;

out vec4 frag_color;

void main()
{
	vec4 color = texture2D(renderedTexture, coord_texture);
	float moy = (color.r + color.g + color.b) / 3;
	frag_color = vec4(moy, moy, moy, color.a);
}


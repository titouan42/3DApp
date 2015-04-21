#version 330

in vec2 coord_texture;

uniform sampler2D renderedTexture;

out vec4 frag_color;

void main()
{
	vec2 size = vec2(682, 582);
	vec4 color = texture2D(renderedTexture, coord_texture);
	int samples = 5;
	float quality = 2.5;
	int diff = (samples - 1) / 2;
	vec2 sizeFactor = vec2(1) / size * quality;
	vec4 sum = vec4(0);

	for (int x = -diff; x <= diff; x++) {
		for (int y = -diff; y <= diff; y++) {
			vec2 offset = vec2(x, y) * sizeFactor;
			sum += texture2D(renderedTexture, coord_texture + offset);
		}
	}

	frag_color = ((sum / (samples * samples)) + color);
}


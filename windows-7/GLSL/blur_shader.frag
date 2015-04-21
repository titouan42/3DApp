#version 330

in vec2 coord_texture;

uniform sampler2D renderedTexture;

out vec4 frag_color;

const float blurSize = 1.0/682.0;
 
void main(void)
{
   vec4 sum = vec4(0.0);
 
   sum += texture2D(renderedTexture, vec2(coord_texture.x - 4.0*blurSize, coord_texture.y)) * 0.05;
   sum += texture2D(renderedTexture, vec2(coord_texture.x - 3.0*blurSize, coord_texture.y)) * 0.09;
   sum += texture2D(renderedTexture, vec2(coord_texture.x - 2.0*blurSize, coord_texture.y)) * 0.12;
   sum += texture2D(renderedTexture, vec2(coord_texture.x - blurSize, coord_texture.y)) * 0.15;
   sum += texture2D(renderedTexture, vec2(coord_texture.x, coord_texture.y)) * 0.16;
   sum += texture2D(renderedTexture, vec2(coord_texture.x + blurSize, coord_texture.y)) * 0.15;
   sum += texture2D(renderedTexture, vec2(coord_texture.x + 2.0*blurSize, coord_texture.y)) * 0.12;
   sum += texture2D(renderedTexture, vec2(coord_texture.x + 3.0*blurSize, coord_texture.y)) * 0.09;
   sum += texture2D(renderedTexture, vec2(coord_texture.x + 4.0*blurSize, coord_texture.y)) * 0.05;
 
   frag_color = sum;
}

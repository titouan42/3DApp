#version 330

const vec2 madd = vec2(0.5,0.5);
in vec2 vertexIn;

out vec2 coord_texture;

void main()
{
   coord_texture = vertexIn.xy * madd + madd;
   gl_Position = vec4(vertexIn.xy,0.0,1.0);
}

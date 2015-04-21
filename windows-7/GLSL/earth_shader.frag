#version 330

uniform sampler2D Map;
uniform sampler2D Lights;
uniform sampler2D Spec;
uniform sampler2D Clouds;
uniform sampler2D Bump;
uniform sampler2D Normal;

uniform float Time;

struct Material {
    vec4 ambiant_color;
    vec4 diffuse_color;
    vec4 specular_color;
    float shineness;
};
uniform Material mat;

struct Light {
    int     type;
    vec3    position;
    vec3    direction;
    vec4    ambient;
    vec4    diffuse;
    vec4    specular;
    float   intensity;
    float   constant_att;
    float   linear_att;
    float   quadratic_att;
    float   cutoff;
    float   coscutoff;
    float   exponent;
};
uniform Light lights[8];

in vec3 eye_pos;
in vec3 eye_normal;
in vec3 vertex_pos;
in vec2 coord_texture;
in vec3 tangent;
in vec3 binormal;
out vec4 fragColor;

const vec4 maxColor = vec4(1.0, 1.0, 1.0, 1.0);
const vec4 minColor = vec4(0.0, 0.0, 0.0, 0.0);
vec3       eye = normalize(eye_pos);
vec3       frag_pos = vertex_pos;
vec3       normal = normalize(eye_normal);
vec4       ambient = minColor;
vec4       diffuse = minColor;
vec4       specular = minColor;

void    calc_ambient(int idx)
{
    ambient += lights[idx].ambient * lights[idx].intensity;
}

void    calc_diffuse_specular(int idx)
{
    float NdotL = 0.0, NdotH = 0.0, att = 0.0, dist = 0.0;
    vec3 light_pos = lights[idx].position;
    vec3 light_dir = light_pos - frag_pos;
    vec3 h;

    if (lights[idx].type > 1)
    {
        NdotL = max(dot(normal, normalize(light_dir)), 0.0);
        h = normalize(light_dir) + normalize(eye);
        NdotH = max(dot(normal, normalize(h)), 0.0);
    }
    else {
        NdotL = max(dot(normal, normalize(lights[idx].direction)), 0.0);
        h = normalize(lights[idx].direction) + normalize(eye);
        NdotH = max(dot(normal, normalize(h)), 0.0);
    }

    if (NdotL > 0.0)
    {
        if (lights[idx].type == 1) // DIRECTIONAL
        {
            diffuse += (lights[idx].diffuse * lights[idx].intensity * NdotL);
            specular += (lights[idx].specular *  lights[idx].intensity * pow(NdotH, mat.shineness));
        }

        if (lights[idx].type == 2) // POINT
        {
            dist = length(light_dir);
            att = (lights[idx].constant_att
                   + lights[idx].linear_att * dist
                   + lights[idx].quadratic_att * dist * dist);
            if (att == 0.0)
                att = 1.0;
            att = 1.0 / att;
            diffuse += (att * (lights[idx].diffuse * NdotL * lights[idx].intensity));
            specular += (att * lights[idx].specular * lights[idx].intensity * pow(NdotH, mat.shineness));
        }

        if (lights[idx].type == 3) // SPOT
        {
            dist = length(light_dir);
            float effect = dot(normalize(lights[idx].direction),
                               normalize(-light_dir));
            if (effect > lights[idx].coscutoff)
            {
                effect = pow(effect, lights[idx].exponent);
                att = (lights[idx].constant_att
                       + lights[idx].linear_att * dist
                       + lights[idx].quadratic_att * dist * dist);
                if (att == 0.0)
                    att = 1.0;
                att = effect / att;
                diffuse += (att * (lights[idx].diffuse * NdotL * lights[idx].intensity));
                specular += (att * lights[idx].specular * lights[idx].intensity * pow(NdotH, mat.shineness));
            }
        }
    }
}

void main(void)
{
    vec3 bump = texture2D(Normal, coord_texture).xyz * 2.0 - 1.0;
    normal = normalize(normal + bump.x * tangent + bump.y * binormal);

    for (int i = 0; i < 8; i++)
    {
        if (lights[i].type != -1)
        {
            if (lights[i].type == 0) {
                calc_ambient(i);
            }
            else {
                calc_diffuse_specular(i);
            }
        }
    }

    ambient = mat.ambiant_color * clamp(ambient, minColor, maxColor);
    diffuse = mat.diffuse_color * clamp(diffuse, minColor, maxColor);
    specular = mat.specular_color * clamp(specular, minColor, maxColor);

    vec3 Specular = specular.rgb;
    float Diffuse = diffuse.r;

    float gloss = texture2D(Spec, coord_texture).r;
    float clouds = texture2D(Clouds, vec2(coord_texture.x + Time, coord_texture.y)).r;

    vec3 daytime = (texture2D(Map, coord_texture).rgb * Diffuse + Specular * gloss) * (1.0 - clouds) + clouds * Diffuse;
    vec3 nighttime = texture2D(Lights, coord_texture).rgb * (1.0 - clouds) * 2.0;
    vec3 color = daytime;

    if (Diffuse < 0.1)
        color = mix(nighttime, daytime, (Diffuse + 0.1) * 5.0);

    fragColor = vec4(color, 1.0);
}

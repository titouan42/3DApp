#version 330

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
out vec4 fragColor;

const vec4 maxColor = vec4(1.0, 1.0, 1.0, 1.0);
const vec4 minColor = vec4(0.0, 0.0, 0.0, 0.0);
vec3 eye = normalize(eye_pos);
vec3 frag_pos = vertex_pos;
vec3 normal = normalize(eye_normal);
vec4       ambient = minColor;
vec4       diffuse = minColor;

float toonish(float dotp)
{
    if (dotp > 0.95)
        dotp = 1.0;
    else if (dotp > 0.5)
        dotp = 0.6;
    else if (dotp > 0.25)
        dotp = 0.3;
    else
        dotp = 0.1;
    return dotp;
}

void calc_ambient(int idx)
{
    ambient += lights[idx].ambient * lights[idx].intensity;
}

vec4 calc_diffuse(int idx)
{
    float NdotL = 0.0, att = 0.0, dist = 0.0;
    vec3 light_pos = lights[idx].position;
    vec3 light_dir = light_pos - frag_pos;

    if (lights[idx].type > 1) {
        NdotL = toonish(max(dot(normal, normalize(light_dir)), 0.0));
    } else {
        NdotL = toonish(max(dot(normal, normalize(lights[idx].direction)), 0.0));
    }

    if (NdotL > 0.0)
    {
        if (lights[idx].type == 1) // DIRECTIONAL
            return lights[idx].diffuse * lights[idx].intensity * NdotL;

        if (lights[idx].type == 2) // POINT
        {
            dist = length(light_dir);
            att = (lights[idx].constant_att
                   + lights[idx].linear_att * dist
                   + lights[idx].quadratic_att * dist * dist);
            if (att == 0.0)
                att = 1.0;
            att = 1.0 / att;
            diffuse += att * (lights[idx].diffuse * NdotL * lights[idx].intensity);
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
                diffuse += att * (lights[idx].diffuse * NdotL * lights[idx].intensity);
            }
        }
    }
    return vec4(0.0, 0.0, 0.0, 1.0); //Default
}

void main(void)
{
    for (int i = 0; i < 8; i++)
    {
        if (lights[i].type != -1)
        {
            if (lights[i].type == 0) {
                calc_ambient(i);
            }
            else {
                calc_diffuse(i);
            }
        }
    }

    ambient = mat.ambiant_color * clamp(ambient, minColor, maxColor);
    diffuse = mat.diffuse_color * clamp(diffuse, minColor, maxColor);
    vec4 res_color = ambient + diffuse;
    res_color[3] = 1.0;
    res_color = clamp(res_color, minColor, maxColor);
    fragColor = res_color;
}

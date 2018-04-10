using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(georespect.Startup))]
namespace georespect
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}

import logging

from ckan.common import json
import ckan.plugins as p
import ckanext.resourceproxy.plugin as proxy
from ckan.plugins import toolkit
import ckan.lib.datapreview as datapreview
from ckan.common import _, request

log = logging.getLogger(__name__)


class NgsiView(p.SingletonPlugin):

    NGSI_FORMATS = ['ngsi9', 'ngsi10']

    p.implements(p.IConfigurer, inherit=True)
    p.implements(p.IConfigurable, inherit=True)
    p.implements(p.IResourceView, inherit=True)

    proxy_is_enabled = False
    oauth2_is_enabled = False


    def update_config(self, config):

        p.implements(p.IRoutes, inherit=True)
        p.toolkit.add_public_directory(config, 'theme/public')
        p.toolkit.add_template_directory(config, 'theme/templates')
        p.toolkit.add_resource('theme/public', 'ckanext-textview')

    def before_map(self, m):
        m.connect('/dataset/{id}/resource/{resource_id}/ngsiproxy',
                  controller='ckanext.ngsipreview.controller:ProxyNGSIController', action='proxy_ngsi_resource')
        return m

    def get_proxified_ngsi_url(self, data_dict):
        url = h.url_for(action='proxy_ngsi_resource', controller='ckanext.ngsipreview.controller:ProxyNGSIController',
                        id=data_dict['package']['name'], resource_id=data_dict['resource']['id'])
        log.info('NGSI proxified url is {0}'.format(url))
        return url

    def info(self):
        return {'name': 'ngsi_view',
                'title': p.toolkit._('NGSI'),
                'icon': 'file-ngsi-alt',
                'default_title': p.toolkit._('NGSI'),
                }

    def check_query(self, resource):
        if (resource['url'].lower().find('/querycontext') != -1
                or resource['url'].lower().find('/contextentities/') != -1):
            return True
        else:
            return False

    def can_view(self, data_dict):
        resource = data_dict['resource']
        if 'oauth_req' not in resource:
            oauth_req = 'false'
        else:
            oauth_req = resource['oauth_req']


        format_lower = resource.get('format', '').lower()
        pattern = "/dataset/"+data_dict['package']['name']+"/resource/"

        proxy_enabled = p.plugin_loaded('resource_proxy')

        if format_lower in self.NGSI_FORMATS:
            same_domain = datapreview.on_same_domain(data_dict)
            pattern = "/dataset/"+data_dict['package']['name']+"/resource/"
            if same_domain or proxy_enabled:
                if self.check_query(resource) and request.path.find(pattern) != -1 and oauth_req == 'true' and not toolkit.c.user:
                    return False
                elif self.check_query(resource) and request.path.find(pattern) != -1 and oauth_req == 'false' and not self.oauth2_is_enabled:
                   return False
                elif (resource['url'].lower().find('/querycontext') != -1
                      and request.path.find(pattern) != -1 and 'payload' not in resource):
                    return False
                else:
                    return True
            else:
                return False
        else:
            return False

    def setup_template_variables(self, context, data_dict):
        metadata = {'ngsi_formats': self.ngsi_formats}

        if not datapreview.on_same_domain(data_dict):
            if self.check_query(data_dict['resource']):
                url = self.get_proxified_ngsi_url(data_dict)
            else:
                url = proxy.get_proxified_resource_url(data_dict)

            return {'preview_metadata': json.dumps(metadata),
                    'resource_json': json.dumps(data_dict['resource']),
                    'resource_url': json.dumps(url)}

    def view_template(self, context, data_dict):
        return 'ngsi.html'

    def form_template(self, context, data_dict):
        return 'text_form.html'

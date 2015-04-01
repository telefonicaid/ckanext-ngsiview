import logging

from ckan.common import json
import ckan.plugins as p
import ckanext.resourceproxy.plugin as proxy
import ckan.lib.datapreview as datapreview

log = logging.getLogger(__name__)

DEFAULT_NGSI_FORMATS = ['ngsi9','ngsi10']

def get_formats(config):
    out = {}
    ngsi_formats = config.get('ckan.preview.ngsi_formats', '').split()
    out['ngsi_formats'] = ngsi_formats or DEFAULT_NGSI_FORMATS
    return out

def check_query(resource):
    if resource['url'].lower().find('/querycontext') != -1 or resource['url'].lower().find('/contextentities/') != -1:
        return True
    else:
        return False


class NgsiView(p.SingletonPlugin):

    NGSI_FORMATS = ['ngsi9', 'ngsi10']
    p.implements(p.IConfigurer, inherit=True)
    p.implements(p.IConfigurable, inherit=True)
    p.implements(p.IResourceView, inherit=True)

    def update_config(self, config):
        formats = get_formats(config)
        for key, value in formats.iteritems():
            setattr(self, key, value)
        p.toolkit.add_public_directory(config, 'theme/public')
        p.toolkit.add_template_directory(config, 'theme/templates')
        p.toolkit.add_resource('theme/public', 'ckanext-textview')

    def info(self):
        return {'name': 'ngsiview',
                'title': p.toolkit._('NGSI'),
                'icon': 'file-text-alt',
                'default_title': p.toolkit._('NGSI'),
                'default_description': 'NGSI resource',
                'always_available': False,
                'iframed': True,
                'preview_enabled': True,
                'full_page_edit': False,
                }

    def can_view(self, data_dict):
        resource = data_dict['resource']
        format_lower = resource.get('format', '').lower()
        proxy_enabled = p.plugin_loaded('resource_proxy')
        same_domain = datapreview.on_same_domain(data_dict)

        if format_lower in self.ngsi_formats and check_query(resource):
            return same_domain or proxy_enabled
        else:
            return False

    def setup_template_variables(self, context, data_dict):
        metadata = {'ngsi_formats': self.ngsi_formats}
        resource = data_dict['resource']
        proxy_enabled = p.plugin_loaded('resource_proxy')
        oauth2_enabled = p.plugin_loaded('oauth2')
        same_domain = datapreview.on_same_domain(data_dict)

        if 'oauth_req' not in resource:
            oauth_req = 'false'
        else:
            oauth_req = resource['oauth_req']

        if proxy_enabled and not same_domain:
            if check_query(resource):
                if oauth_req == 'true' and (not toolkit.c.user or not oauth2_enabled):
                    metadata = "hace falta token y no se puede conseguir"
                    url = proxy.get_proxified_resource_url(data_dict)
                else:
                    url = proxy.get_proxified_resource_url(data_dict)
                    data_dict['resource']['url'] = url
            else:
                metadata = "el proxy esta y no existe ngsi (archivo)"
                url = proxy.get_proxified_resource_url(data_dict)
        else:
            metadata = "falta el proxy o es un recurso externo y no existe ngsi archivo)"
            url = ''

        return {'preview_metadata': json.dumps(metadata),
                'resource_json': json.dumps(data_dict['resource']),
                'resource_url': json.dumps(url)}
    
    def view_template(self, context, data_dict):
        return 'ngsi.html'
import logging

from ckan.common import json
import ckan.plugins as p
import ckanext.resourceproxy.plugin as proxy
import ckan.lib.datapreview as datapreview

log = logging.getLogger(__name__)

DEFAULT_NGSI_FORMATS = ['ngsi9', 'ngsi10']


def get_formats(config):

    out = {}

    ngsi_formats = config.get('ckan.preview.ngsi_formats', '').split()
    out['ngsi_formats'] = ngsi_formats or DEFAULT_NGSI_FORMATS

    return out


class TextView(p.SingletonPlugin):
    '''This extension previews JSON(P).'''

    p.implements(p.IConfigurer, inherit=True)
    p.implements(p.IConfigurable, inherit=True)
    p.implements(p.IResourceView, inherit=True)

    proxy_is_enabled = False
    ngsi_formats = []

    def update_config(self, config):

        formats = get_formats(config)
        for key, value in formats.iteritems():
            setattr(self, key, value)

        p.toolkit.add_public_directory(config, 'theme/public')
        p.toolkit.add_template_directory(config, 'theme/templates')
        p.toolkit.add_resource('theme/public', 'ckanext-textview')

    def info(self):
        return {'name': 'ngsi_view',
                'title': p.toolkit._('NGSI'),
                'icon': 'file-ngsi-alt',
                'default_title': p.toolkit._('NGSI'),
                }

    def can_view(self, data_dict):
        resource = data_dict['resource']
        format_lower = resource.get('format', '').lower()
        proxy_enabled = p.plugin_loaded('resource_proxy')
        same_domain = datapreview.on_same_domain(data_dict)
        if format_lower in self.jsonp_formats:
            return True
        if format_lower in self.no_jsonp_formats:
            return proxy_enabled or same_domain
        return False

    def setup_template_variables(self, context, data_dict):
        metadata = {'text_formats': self.text_formats,
                    'json_formats': self.json_formats,
                    'jsonp_formats': self.jsonp_formats,
                    'xml_formats': self.xml_formats}

        url = proxy.get_proxified_resource_url(data_dict)
        format_lower = data_dict['resource']['format'].lower()
        if format_lower in self.jsonp_formats:
            url = data_dict['resource']['url']

        return {'preview_metadata': json.dumps(metadata),
                'resource_json': json.dumps(data_dict['resource']),
                'resource_url': json.dumps(url)}

    def view_template(self, context, data_dict):
        return 'text_view.html'

    def form_template(self, context, data_dict):
        return 'text_form.html'

from setuptools import setup, find_packages  # Always prefer setuptools over distutils

setup(
    name='ckanext-ngsiview',
    version='0.0.1',
    url='https://github.com//ckanext-ngsiview',
    classifiers=[
        'Development Status :: 4 - Beta',
        'License :: OSI Approved :: GNU Affero General Public License v3 or later (AGPLv3+)',
        'Programming Language :: Python :: 2.7',
    ],
    packages=find_packages(exclude=['contrib', 'docs', 'tests*']),
    install_requires=[],
    include_package_data=True,
    package_data={
    },
    data_files=[],
    entry_points='''
        [ckan.plugins]
        ngsiview=ckanext.ngsiview.plugin:NgsiviewPlugin
    ''',
)

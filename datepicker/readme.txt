�������������� ������ ������ 
 *  @author     Stefan Gabos <contact@stefangabos.ro>
 *  @version    1.9.18 (last revision: December 31, 2020)

���������� ������, �������� ������ 632
// (or this won't work when doing $.inArray(): enabled_hours: ['11', '12', '13'])
if ($.isArray(plugin.settings.enabled_hours)) plugin.settings.enabled_hour = plugin.settings.enabled_hours.map(function(value) { return parseInt(value, 10); })
���������� 
if ($.isArray(plugin.settings.enabled_hours)) plugin.settings.enabled_hours= plugin.settings.enabled_hours.map(function(value) { return parseInt(value, 10); })
� �.�.
��������� ����� ����������. �������� ���� � input ������� ���� ���������� ���� (� �� ����� ���) �� �������. 
������� ����� �������� ����������, ��������� ��������� ��� ������� ����. 
� �.�.

������ ������ Stefan Gabos <contact@stefangabos.ro> - ���� ���� ������ !!!

from flask import Blueprint, request, jsonify
from models.usuarios import Usuarios
from models.empresas import Empresas

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/api/stats/visitors')
def visitor_stats():
    """Muestra estadísticas de visitantes - solo para admin"""
    # TODO: Implementar autenticación de administrador
    from collections import defaultdict
    from datetime import datetime
    
    ip_tracker = defaultdict(lambda: {'count': 0, 'last_seen': None, 'pages': set()})
    
    stats = []
    for ip, data in ip_tracker.items():
        stats.append({
            'ip': ip,
            'visits': data['count'],
            'last_seen': data['last_seen'].strftime('%Y-%m-%d %H:%M:%S') if data['last_seen'] else None,
            'pages_visited': len(data['pages']),
            'unique_pages': list(data['pages'])
        })
    
    # Ordenar por número de visitas
    stats.sort(key=lambda x: x['visits'], reverse=True)
    
    return jsonify({
        'total_unique_visitors': len(ip_tracker),
        'total_visits': sum(d['count'] for d in ip_tracker.values()),
        'visitors': stats
    })
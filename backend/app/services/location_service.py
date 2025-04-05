from typing import Tuple, Optional, Dict

class LocationService:
    """Service for handling location-related operations."""
    
    def __init__(self):
        pass
    
    async def get_city_from_coordinates(self, latitude: float, longitude: float) -> Optional[str]:
        """
        Get city name from coordinates using reverse geocoding.
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            
        Returns:
            City name or None if not found
        """
        
        city_coordinates = {
            "北京": (39.9042, 116.4074),
            "上海": (31.2304, 121.4737),
            "广州": (23.1291, 113.2644),
            "深圳": (22.5431, 114.0579),
        }
        
        closest_city = None
        min_distance = float('inf')
        
        for city, coords in city_coordinates.items():
            city_lat, city_lon = coords
            distance = self._calculate_distance(latitude, longitude, city_lat, city_lon)
            
            if distance < min_distance:
                min_distance = distance
                closest_city = city
        
        if min_distance < 50:
            return closest_city
        
        return "未知位置"
    
    def _calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calculate distance between two coordinates in kilometers.
        This is a simplified version using the Euclidean distance.
        """
        return ((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2) ** 0.5 * 111  # Rough conversion to km

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      Card: {
        Row: {
          category_id: string
          creator: string | null
          game_id: string
          id: string
          name: string
          picture_url: string
          played: boolean
          player_id: string | null
          year: number
        }
        Insert: {
          category_id: string
          creator?: string | null
          game_id: string
          id?: string
          name: string
          picture_url: string
          played?: boolean
          player_id?: string | null
          year: number
        }
        Update: {
          category_id?: string
          creator?: string | null
          game_id?: string
          id?: string
          name?: string
          picture_url?: string
          played?: boolean
          player_id?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "Card_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "Category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Card_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "Game"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Card_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "Player"
            referencedColumns: ["id"]
          },
        ]
      }
      Category: {
        Row: {
          api_route: string | null
          hex_color: string
          id: string
          name: string
          picture_path: string | null
        }
        Insert: {
          api_route?: string | null
          hex_color?: string
          id?: string
          name: string
          picture_path?: string | null
        }
        Update: {
          api_route?: string | null
          hex_color?: string
          id?: string
          name?: string
          picture_path?: string | null
        }
        Relationships: []
      }
      Game: {
        Row: {
          category_id: string
          creator_code: string
          difficulty: Database["public"]["Enums"]["difficulty"]
          id: string
          max_card_count: number
          status: Database["public"]["Enums"]["status"]
          time_created: string
          whose_turn_id: string | null
          winner_id: string | null
        }
        Insert: {
          category_id: string
          creator_code: string
          difficulty?: Database["public"]["Enums"]["difficulty"]
          id?: string
          max_card_count?: number
          status?: Database["public"]["Enums"]["status"]
          time_created?: string
          whose_turn_id?: string | null
          winner_id?: string | null
        }
        Update: {
          category_id?: string
          creator_code?: string
          difficulty?: Database["public"]["Enums"]["difficulty"]
          id?: string
          max_card_count?: number
          status?: Database["public"]["Enums"]["status"]
          time_created?: string
          whose_turn_id?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Game_category_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "Category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Game_whose_turn_fkey"
            columns: ["whose_turn_id"]
            isOneToOne: false
            referencedRelation: "Player"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Game_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "Player"
            referencedColumns: ["id"]
          },
        ]
      }
      Player: {
        Row: {
          avatar_path: string
          cards_count: number | null
          game_id: string
          id: string
          is_creator: boolean
          is_online: boolean
          is_ready: boolean
          name: string
        }
        Insert: {
          avatar_path: string
          cards_count?: number | null
          game_id: string
          id?: string
          is_creator?: boolean
          is_online?: boolean
          is_ready?: boolean
          name: string
        }
        Update: {
          avatar_path?: string
          cards_count?: number | null
          game_id?: string
          id?: string
          is_creator?: boolean
          is_online?: boolean
          is_ready?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "Player_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "Game"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      difficulty: "easy" | "medium" | "hard" | "extreme"
      status: "not_started" | "setting_up" | "running" | "completed" | "aborted"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

